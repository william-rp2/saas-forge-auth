/**
 * ProductForm Component
 * 
 * Formulário reutilizável para criação e edição de produtos
 * Integra com Multi-tenancy, RBAC e Entitlements
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useTeams } from '@/lib/contexts/TeamContext';
import { Uploader, UploaderFile } from '@/components/shared/Uploader';
import { mockDb, MockProduct } from '@/mocks/db';

/**
 * Schema de validação para o formulário de produtos
 */
const productSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100, 'Nome muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional().or(z.literal('')),
  status: z.enum(['ACTIVE', 'INACTIVE']),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  /** Produto para edição (undefined para criação) */
  product?: MockProduct;
  /** Callback chamado após salvar com sucesso */
  onSave: (product: MockProduct) => void;
  /** Callback para cancelar */
  onCancel: () => void;
}

/**
 * Componente ProductForm
 * 
 * @example
 * ```tsx
 * // Para criar novo produto
 * <ProductForm 
 *   onSave={(product) => console.log('Criado:', product)}
 *   onCancel={() => setDialogOpen(false)}
 * />
 * 
 * // Para editar produto existente
 * <ProductForm 
 *   product={selectedProduct}
 *   onSave={(product) => console.log('Atualizado:', product)}
 *   onCancel={() => setDialogOpen(false)}
 * />
 * ```
 */
export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<UploaderFile[]>([]);
  const { toast } = useToast();
  const { currentTeamId } = useTeams();

  const isEditing = !!product;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      status: product?.status || 'ACTIVE',
    },
  });

  /**
   * Reset form when product changes
   */
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        description: product.description,
        status: product.status,
      });
    }
  }, [product, form]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ProductFormData) => {
    if (!currentTeamId) {
      toast({
        title: 'Erro',
        description: 'Nenhuma equipe selecionada',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      let result: MockProduct;

      if (isEditing) {
        // Update existing product
        result = mockDb.updateProduct(product.id, {
          name: data.name,
          description: data.description || '',
          status: data.status,
        });

        if (!result) {
          throw new Error('Produto não encontrado');
        }

        toast({
          title: 'Sucesso',
          description: 'Produto atualizado com sucesso',
        });
      } else {
        // Create new product
        result = mockDb.createProduct({
          name: data.name,
          description: data.description || '',
          status: data.status,
          teamId: currentTeamId,
        });

        toast({
          title: 'Sucesso',
          description: 'Produto criado com sucesso',
        });
      }

      onSave(result);
      form.reset();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao salvar produto',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? 'Editar Produto' : 'Criar Novo Produto'}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Nome do Produto */}
        <div className="space-y-2">
          <Label htmlFor="name">Nome do Produto *</Label>
          <Input
            id="name"
            {...form.register('name')}
            placeholder="Digite o nome do produto"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-destructive">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        {/* Descrição */}
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            {...form.register('description')}
            placeholder="Descreva o produto (opcional)"
            rows={3}
          />
          {form.formState.errors.description && (
            <p className="text-sm text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select
            value={form.watch('status')}
            onValueChange={(value: 'ACTIVE' | 'INACTIVE') => 
              form.setValue('status', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Ativo</SelectItem>
              <SelectItem value="INACTIVE">Inativo</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <p className="text-sm text-destructive">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>

        <Separator className="my-6" />

        {/* Anexos */}
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold">Anexos do Produto</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Faça upload de documentos, imagens ou outros arquivos relacionados ao produto
            </p>
          </div>
          
          <Uploader
            path="products/"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            maxFiles={10}
            maxFileSize={25 * 1024 * 1024} // 25MB
            onUploadComplete={(files) => {
              setAttachments(prev => [...prev, ...files]);
              toast({
                title: 'Anexos carregados',
                description: `${files.length} arquivo(s) anexado(s) ao produto.`,
              });
            }}
            onUploadError={(error) => {
              toast({
                title: 'Erro no upload',
                description: error,
                variant: 'destructive',
              });
            }}
          />

          {/* Lista de anexos atuais */}
          {attachments.length > 0 && (
            <div className="mt-4">
              <Label className="text-sm font-medium">Anexos ({attachments.length})</Label>
              <div className="mt-2 space-y-2">
                {attachments.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center text-xs">
                        {file.type.startsWith('image/') ? 'IMG' : 'DOC'}
                      </div>
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({Math.round(file.size / 1024)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setAttachments(prev => prev.filter(f => f.id !== file.id))}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </div>
  );
}