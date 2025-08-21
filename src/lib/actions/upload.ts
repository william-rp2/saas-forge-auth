/**
 * Server Actions para Upload de Arquivos
 * 
 * Implementa upload real para Supabase Storage com:
 * - Isolamento por team_id
 * - Validação de tipos e tamanhos
 * - Integração com limites de plano
 * - Políticas de segurança RLS
 */

'use server';

import { supabase } from '@/integrations/supabase/client';
import { mockDb } from '@/mocks/db';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  fileId?: string;
}

export interface UploadOptions {
  teamId: string;
  userId: string;
  bucket: 'avatars' | 'documents';
  path: string;
  maxFileSize?: number;
  allowedTypes?: string[];
}

/**
 * Valida arquivo antes do upload
 */
function validateFile(
  file: File,
  options: UploadOptions
): { valid: boolean; error?: string } {
  // Validar tamanho
  const maxSize = options.maxFileSize || 10 * 1024 * 1024; // 10MB padrão
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `Arquivo muito grande. Máximo: ${Math.round(maxSize / 1024 / 1024)}MB`
    };
  }

  // Validar tipo
  if (options.allowedTypes && options.allowedTypes.length > 0) {
    const isAllowed = options.allowedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      if (type.includes('*')) {
        const baseType = type.split('/')[0];
        return file.type.startsWith(baseType);
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Aceitos: ${options.allowedTypes.join(', ')}`
      };
    }
  }

  return { valid: true };
}

/**
 * Gera caminho único para o arquivo com isolamento por team
 */
function generateFilePath(
  fileName: string,
  options: UploadOptions
): string {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  const fileExtension = fileName.split('.').pop();
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  if (options.bucket === 'avatars') {
    // Para avatars: avatars/{userId}/avatar_{timestamp}.{ext}
    return `${options.userId}/avatar_${timestamp}.${fileExtension}`;
  } else {
    // Para documentos: {teamId}/{path}/{fileName}_{randomId}.{ext}
    const baseName = cleanFileName.replace(`.${fileExtension}`, '');
    return `${options.teamId}/${options.path}${baseName}_${randomId}.${fileExtension}`;
  }
}

/**
 * Calcula o uso atual de storage da equipe baseado nos dados mockados
 */
function calculateCurrentUsage(teamId: string): number {
  // Simular cálculo de uso atual baseado nos documentos da equipe
  const teamDocuments = mockDb.documents.filter(doc => doc.team_id === teamId);
  const totalUsage = teamDocuments.reduce((sum, doc) => {
    // Simular tamanho dos arquivos (em bytes)
    // Em produção, isso viria do Supabase Storage
    const mockFileSize = Math.floor(Math.random() * 5 * 1024 * 1024); // 0-5MB por arquivo
    return sum + mockFileSize;
  }, 0);

  return totalUsage;
}

/**
 * Verifica limites de storage do plano
 */
function checkStorageLimit(
  teamId: string,
  newFileSize: number
): { allowed: boolean; error?: string } {
  // Para avatars (teamId vazio), não há limite de equipe
  if (!teamId) {
    return { allowed: true };
  }

  // Buscar plano da equipe nos dados mockados
  const team = mockDb.teams.find(t => t.id === teamId);
  if (!team) {
    return { allowed: false, error: 'Equipe não encontrada' };
  }

  const plan = mockDb.plans.find(p => p.id === team.plan_id);
  if (!plan) {
    return { allowed: false, error: 'Plano não encontrado' };
  }

  // Buscar limite de storage
  const storageLimit = mockDb.plan_limits.find(
    l => l.plan_id === plan.id && l.limit_key === 'storage-limit-mb'
  );

  if (!storageLimit) {
    return { allowed: true }; // Sem limite definido
  }

  const limitInBytes = storageLimit.limit_value * 1024 * 1024;
  const currentUsage = calculateCurrentUsage(teamId);
  
  if (currentUsage + newFileSize > limitInBytes) {
    const currentUsageMB = Math.round(currentUsage / 1024 / 1024);
    const newFileMB = Math.round(newFileSize / 1024 / 1024);
    
    return {
      allowed: false,
      error: `Limite de armazenamento excedido. Uso atual: ${currentUsageMB}MB. Tentando adicionar: ${newFileMB}MB. Limite: ${storageLimit.limit_value}MB`
    };
  }

  return { allowed: true };
}

/**
 * Upload de arquivo para Supabase Storage
 */
export async function uploadFile(
  formData: FormData,
  options: UploadOptions
): Promise<UploadResult> {
  try {
    const file = formData.get('file') as File;
    
    if (!file) {
      return {
        success: false,
        error: 'Nenhum arquivo fornecido'
      };
    }

    // Validar arquivo
    const validation = validateFile(file, options);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Verificar limites de storage
    const storageCheck = checkStorageLimit(options.teamId, file.size);
    if (!storageCheck.allowed) {
      return {
        success: false,
        error: storageCheck.error
      };
    }

    // Gerar caminho único
    const filePath = generateFilePath(file.name, options);

    // Upload para Supabase Storage
    const { data, error } = await supabase.storage
      .from(options.bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return {
        success: false,
        error: `Erro no upload: ${error.message}`
      };
    }

    // Obter URL pública
    const { data: urlData } = supabase.storage
      .from(options.bucket)
      .getPublicUrl(filePath);

    // Salvar metadados no banco (se for documento)
    let documentId: string | undefined;
    
    if (options.bucket === 'documents') {
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          url: urlData.publicUrl,
          file_type: file.type,
          size_in_bytes: file.size,
          uploader_user_id: options.userId,
        })
        .select('id')
        .single();

      if (docError) {
        console.error('Error saving document metadata:', docError);
        // Não falha o upload, apenas log do erro
      } else {
        documentId = docData?.id;
      }
    }

    return {
      success: true,
      url: urlData.publicUrl,
      fileId: documentId
    };

  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido no upload'
    };
  }
}

/**
 * Upload de avatar (helper específico)
 */
export async function uploadAvatar(
  formData: FormData,
  userId: string
): Promise<UploadResult> {
  return uploadFile(formData, {
    teamId: '', // Avatars não precisam de team isolation
    userId,
    bucket: 'avatars',
    path: '',
    maxFileSize: 5 * 1024 * 1024, // 5MB para avatars
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  });
}

/**
 * Upload de documento (helper específico)
 */
export async function uploadDocument(
  formData: FormData,
  teamId: string,
  userId: string,
  path: string = 'general/'
): Promise<UploadResult> {
  return uploadFile(formData, {
    teamId,
    userId,
    bucket: 'documents',
    path,
    maxFileSize: 50 * 1024 * 1024, // 50MB para documentos
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  });
}

/**
 * Upload de anexo de produto (helper específico)
 */
export async function uploadProductAttachment(
  formData: FormData,
  teamId: string,
  userId: string,
  productId: string
): Promise<UploadResult> {
  return uploadFile(formData, {
    teamId,
    userId,
    bucket: 'documents',
    path: `products/${productId}/`,
    maxFileSize: 25 * 1024 * 1024, // 25MB para anexos de produto
    allowedTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/webp'
    ]
  });
}

/**
 * Deletar arquivo do Supabase Storage
 */
export async function deleteFile(
  bucket: 'avatars' | 'documents',
  filePath: string,
  documentId?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Deletar do Storage
    const { error: storageError } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (storageError) {
      return {
        success: false,
        error: `Erro ao deletar arquivo: ${storageError.message}`
      };
    }

    // Deletar metadados se for documento
    if (bucket === 'documents' && documentId) {
      const { error: docError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (docError) {
        console.error('Error deleting document metadata:', docError);
        // Não falha a operação, apenas log
      }
    }

    return { success: true };

  } catch (error) {
    console.error('Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao deletar'
    };
  }
}

/**
 * Listar arquivos de uma equipe
 */
export async function listTeamFiles(
  teamId: string
): Promise<{ success: boolean; files?: any[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('team_id', teamId)
      .order('created_at', { ascending: false });

    if (error) {
      return {
        success: false,
        error: `Erro ao listar arquivos: ${error.message}`
      };
    }

    return {
      success: true,
      files: data || []
    };

  } catch (error) {
    console.error('List files error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido ao listar arquivos'
    };
  }
}