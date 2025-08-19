/**
 * ProductsDataTable Component
 * 
 * Tabela de dados para gerenciamento de produtos com integração completa
 * Multi-tenancy, RBAC e Entitlements
 */

import { useState, useEffect } from 'react';
import { 
  Edit, 
  Trash2, 
  Plus,
  Package,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { useTeams } from '@/lib/contexts/TeamContext';
import { mockDb, MockProduct } from '@/mocks/db';
import ProductForm from './ProductForm';

/**
 * Componente ProductsDataTable
 * 
 * Demonstra a integração completa da arquitetura:
 * - Multi-tenancy: Lista apenas produtos da equipe atual
 * - RBAC: Controla visibilidade de ações baseado em permissões
 * - Entitlements: Limita criação baseado no plano
 * 
 * @example
 * ```tsx
 * <ProductsDataTable />
 * ```
 */
export default function ProductsDataTable() {
  const [products, setProducts] = useState<MockProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<MockProduct | undefined>();
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const { can } = usePermissions();
  const { getLimit, currentPlan } = useEntitlements();
  const { currentTeamId } = useTeams();

  // RBAC: Check permissions
  const canCreate = can('create', 'Product');
  const canUpdate = can('update', 'Product');
  const canDelete = can('delete', 'Product');
  const canRead = can('read', 'Product');

  // Entitlements: Get limits
  const maxProducts = getLimit('max-products');
  const currentProductCount = products.length;
  const isAtLimit = maxProducts > 0 && currentProductCount >= maxProducts;

  /**
   * Load products for current team (Multi-tenancy)
   */
  const loadProducts = () => {
    if (!currentTeamId) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      const teamProducts = mockDb.getTeamProducts(currentTeamId);
      setProducts(teamProducts);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar produtos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Load products when team changes
   */
  useEffect(() => {
    loadProducts();
  }, [currentTeamId]);

  /**
   * Handle product creation/update
   */
  const handleProductSave = (product: MockProduct) => {
    loadProducts();
    setFormDialogOpen(false);
    setSelectedProduct(undefined);
  };

  /**
   * Handle product deletion
   */
  const handleDelete = async (product: MockProduct) => {
    try {
      const success = mockDb.deleteProduct(product.id);
      
      if (success) {
        loadProducts();
        toast({
          title: 'Sucesso',
          description: 'Produto excluído com sucesso',
        });
      } else {
        throw new Error('Produto não encontrado');
      }
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir produto',
        variant: 'destructive',
      });
    }
  };

  /**
   * Open create dialog
   */
  const handleCreate = () => {
    setSelectedProduct(undefined);
    setFormDialogOpen(true);
  };

  /**
   * Open edit dialog
   */
  const handleEdit = (product: MockProduct) => {
    setSelectedProduct(product);
    setFormDialogOpen(true);
  };

  /**
   * Get status badge variant
   */
  const getStatusBadgeVariant = (status: string) => {
    return status === 'ACTIVE' ? 'default' : 'secondary';
  };

  /**
   * Get status label
   */
  const getStatusLabel = (status: string) => {
    return status === 'ACTIVE' ? 'Ativo' : 'Inativo';
  };

  // Don't render if user can't read products
  if (!canRead) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p>Você não tem permissão para visualizar produtos.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        <p>Carregando produtos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with create button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Seus Produtos</h2>
        </div>

        {canCreate && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCreate}
                  disabled={isAtLimit}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Criar Novo Produto</span>
                </Button>
              </TooltipTrigger>
              {isAtLimit && (
                <TooltipContent>
                  <p>
                    Você atingiu o limite de produtos para o seu plano ({maxProducts}).
                    <br />
                    Faça um upgrade para criar mais.
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Limits info */}
      {currentPlan && (
        <div className="text-sm text-muted-foreground">
          Plano {currentPlan.name}: {currentProductCount} de {maxProducts === -1 ? '∞' : maxProducts} produtos utilizados
        </div>
      )}

      {/* Products table */}
      {products.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          <div className="text-center">
            <Package className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhum produto encontrado.</p>
            {canCreate && !isAtLimit && (
              <Button onClick={handleCreate} className="mt-4">
                Criar Primeiro Produto
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Produto</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-32">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    {product.name}
                  </TableCell>
                  <TableCell>
                    {product.description ? (
                      <span className="text-muted-foreground">
                        {product.description.length > 100
                          ? `${product.description.substring(0, 100)}...`
                          : product.description
                        }
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">
                        Sem descrição
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(product.status)}>
                      {getStatusLabel(product.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {canUpdate && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar produto</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      {canDelete && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o produto "{product.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Product Form Dialog */}
      <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <DialogContent className="max-w-md">
          <ProductForm
            product={selectedProduct}
            onSave={handleProductSave}
            onCancel={() => setFormDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}