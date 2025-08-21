/**
 * Uploader Component - Generic file upload component
 * 
 * Este componente encapsula toda a lógica de upload de arquivos com Supabase Storage.
 * Suporta drag-and-drop, validação de tipos de arquivo, progress tracking e integração 
 * com limites de plano (entitlements).
 * 
 * @example
 * // Upload de avatar único
 * <Uploader
 *   path="avatars/"
 *   accept="image/*"
 *   maxFiles={1}
 *   onUploadComplete={(files) => console.log(files)}
 * />
 * 
 * @example  
 * // Upload múltiplo de documentos
 * <Uploader
 *   path="documents/"
 *   accept=".pdf,.doc,.docx"
 *   maxFiles={5}
 *   onUploadComplete={(files) => console.log(files)}
 * />
 */

import React, { useCallback, useState } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useTeams } from '@/lib/contexts/TeamContext';
import { mockDb } from '@/mocks/db';
import { uploadFile, uploadAvatar, uploadDocument, uploadProductAttachment } from '@/lib/actions/upload';

export interface UploaderFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

export interface UploaderProps {
  /**
   * Caminho de destino no Supabase Storage (ex: "avatars/", "documents/")
   */
  path: string;
  
  /**
   * Tipos de arquivo aceitos (ex: "image/*", ".pdf,.doc")
   */
  accept?: string;
  
  /**
   * Número máximo de arquivos permitidos
   */
  maxFiles?: number;
  
  /**
   * Tamanho máximo por arquivo em bytes
   */
  maxFileSize?: number;
  
  /**
   * Callback executado quando upload é concluído com sucesso
   */
  onUploadComplete?: (files: UploaderFile[]) => void;
  
  /**
   * Callback executado quando há erro no upload
   */
  onUploadError?: (error: string) => void;
  
  /**
   * Classe CSS adicional
   */
  className?: string;
  
  /**
   * Se deve verificar limites de storage do plano
   */
  checkStorageLimit?: boolean;
}

/**
 * Componente Uploader genérico e reutilizável
 */
export function Uploader({
  path,
  accept = '*/*',
  maxFiles = 5,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  onUploadComplete,
  onUploadError,
  className,
  checkStorageLimit = true,
}: UploaderProps) {
  const [files, setFiles] = useState<UploaderFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const { getLimit } = useEntitlements();
  const { currentTeamId } = useTeams();

  /**
   * Realiza upload real para Supabase Storage
   */
  const performUpload = useCallback(async (file: File): Promise<UploaderFile> => {
    const uploadFile: UploaderFile = {
      id: Math.random().toString(36),
      name: file.name,
      url: '',
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0,
    };

    try {
      // Simular progresso inicial
      const progressInterval = setInterval(() => {
        setFiles(current => 
          current.map(f => {
            if (f.id === uploadFile.id && f.progress < 90) {
              return { ...f, progress: f.progress + 10 };
            }
            return f;
          })
        );
      }, 200);

      // Preparar FormData
      const formData = new FormData();
      formData.append('file', file);

      // Determinar tipo de upload e chamar Server Action apropriada
      let result;
      const userId = '1'; // Mock user ID - em produção viria do contexto de auth
      
      if (path.startsWith('avatars/')) {
        result = await uploadAvatar(formData, userId);
      } else if (path.includes('products/')) {
        const productId = path.split('products/')[1]?.split('/')[0] || 'unknown';
        result = await uploadProductAttachment(formData, currentTeamId || '1', userId, productId);
      } else {
        result = await uploadDocument(formData, currentTeamId || '1', userId, path);
      }

      clearInterval(progressInterval);

      if (result.success && result.url) {
        uploadFile.progress = 100;
        uploadFile.status = 'success';
        uploadFile.url = result.url;
        
        // Log para desenvolvimento
        console.log('Real upload completed:', {
          name: file.name,
          url: result.url,
          type: file.type,
          size: file.size,
          teamId: currentTeamId,
          path: path,
          fileId: result.fileId
        });
        
        return uploadFile;
      } else {
        throw new Error(result.error || 'Upload failed');
      }

    } catch (error) {
      uploadFile.status = 'error';
      uploadFile.progress = 0;
      throw error;
    }
  }, [path, currentTeamId]);

  /**
   * Calcula o uso atual de storage da equipe baseado nos dados mockados
   */
  const calculateCurrentUsage = useCallback((): number => {
    if (!currentTeamId) return 0;

    // Simular cálculo de uso atual baseado nos documentos da equipe
    const teamDocuments = mockDb.documents.filter(doc => doc.team_id === currentTeamId);
    const totalUsage = teamDocuments.reduce((sum, doc) => {
      // Simular tamanho dos arquivos (em bytes)
      // Em produção, isso viria do Supabase Storage
      const mockFileSize = Math.floor(Math.random() * 5 * 1024 * 1024); // 0-5MB por arquivo
      return sum + mockFileSize;
    }, 0);

    return totalUsage;
  }, [currentTeamId]);

  /**
   * Verifica se o upload pode ser realizado (storage limits)
   */
  const canUpload = useCallback((newFiles: File[]): boolean => {
    if (!checkStorageLimit) return true;

    const storageLimit = getLimit('storage-limit-mb') * 1024 * 1024; // Convert MB to bytes
    const currentUsage = calculateCurrentUsage();
    const newFilesSize = newFiles.reduce((sum, file) => sum + file.size, 0);

    if (currentUsage + newFilesSize > storageLimit) {
      const currentUsageMB = Math.round(currentUsage / 1024 / 1024);
      const limitMB = getLimit('storage-limit-mb');
      const newFilesMB = Math.round(newFilesSize / 1024 / 1024);
      
      toast({
        title: "Limite de armazenamento excedido",
        description: `Uso atual: ${currentUsageMB}MB. Tentando adicionar: ${newFilesMB}MB. Limite: ${limitMB}MB.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  }, [checkStorageLimit, getLimit, toast, calculateCurrentUsage]);

  /**
   * Processa os arquivos selecionados
   */
  const handleFiles = useCallback(async (selectedFiles: File[]) => {
    // Verifica limite de arquivos
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Muitos arquivos",
        description: `Máximo de ${maxFiles} arquivos permitidos.`,
        variant: "destructive",
      });
      return;
    }

    // Verifica tamanho dos arquivos
    const oversizedFiles = selectedFiles.filter(file => file.size > maxFileSize);
    if (oversizedFiles.length > 0) {
      toast({
        title: "Arquivo muito grande",
        description: `Tamanho máximo: ${Math.round(maxFileSize / 1024 / 1024)}MB`,
        variant: "destructive",
      });
      return;
    }

    // Verifica limites de storage
    if (!canUpload(selectedFiles)) {
      return;
    }

    // Adiciona arquivos ao estado com status inicial
    const newFiles: UploaderFile[] = selectedFiles.map(file => ({
      id: Math.random().toString(36),
      name: file.name,
      url: '',
      type: file.type,
      size: file.size,
      status: 'uploading',
      progress: 0,
    }));

    setFiles(current => [...current, ...newFiles]);

    try {
      // Faz upload de cada arquivo
      const uploadPromises = selectedFiles.map((file, index) => 
        performUpload(file)
      );

      const uploadedFiles = await Promise.all(uploadPromises);
      onUploadComplete?.(uploadedFiles);

      toast({
        title: "Upload concluído",
        description: `${uploadedFiles.length} arquivo(s) enviado(s) com sucesso.`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro no upload';
      onUploadError?.(errorMessage);
      
      toast({
        title: "Erro no upload",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [files.length, maxFiles, maxFileSize, canUpload, performUpload, onUploadComplete, onUploadError, toast]);

  /**
   * Manipula drag and drop
   */
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [handleFiles]);

  /**
   * Manipula seleção de arquivos via input
   */
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    handleFiles(selectedFiles);
  }, [handleFiles]);

  /**
   * Remove arquivo da lista
   */
  const removeFile = useCallback((fileId: string) => {
    setFiles(current => current.filter(f => f.id !== fileId));
  }, []);

  /**
   * Renderiza ícone do arquivo baseado no tipo
   */
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center text-primary text-xs">IMG</div>;
    }
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Área de Upload */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
          isDragOver
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-2">
          Arraste seus arquivos aqui
        </h3>
        <p className="text-muted-foreground mb-4">
          ou clique para selecionar
        </p>
        
        <input
          type="file"
          multiple={maxFiles > 1}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
        />
        
        <Button asChild variant="outline">
          <label htmlFor="file-upload" className="cursor-pointer">
            Selecionar Arquivos
          </label>
        </Button>
        
        <p className="text-xs text-muted-foreground mt-2">
          Máximo: {maxFiles} arquivo(s), {Math.round(maxFileSize / 1024 / 1024)}MB cada
        </p>
      </div>

      {/* Lista de Arquivos */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Arquivos</h4>
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              {getFileIcon(file.type)}
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(file.size / 1024)} KB
                </p>
                
                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="mt-1" />
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {file.status === 'success' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {file.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}