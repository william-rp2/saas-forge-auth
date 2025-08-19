/**
 * Products Page - Página principal de gerenciamento de produtos
 * 
 * Primeira implementação prática do sistema multi-tenant
 * Demonstra integração completa: Teams + RBAC + Entitlements
 */

import { Helmet } from 'react-helmet-async';
import ProductsDataTable from '@/components/features/products/ProductsDataTable';
import { Can } from '@/components/shared/Can';

/**
 * Página de gerenciamento de produtos
 * 
 * Esta página serve como template para todos os futuros módulos de negócio,
 * demonstrando como integrar corretamente:
 * - Multi-tenancy (isolamento por equipe)
 * - RBAC (controle de acesso baseado em permissões)
 * - Entitlements (limites baseados no plano)
 * 
 * @example
 * Rota: /admin/products
 */
export default function ProductsPage() {
  return (
    <>
      <Helmet>
        <title>Produtos - Administração</title>
        <meta name="description" content="Gerencie seus produtos" />
      </Helmet>

      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos da sua equipe
          </p>
        </div>

        {/* Protected Content - Only show if user can read products */}
        <Can action="read" subject="Product">
          <ProductsDataTable />
        </Can>

        {/* Fallback for users without permissions */}
        <Can 
          action="read" 
          subject="Product" 
          fallback={
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta seção.
              </p>
            </div>
          }
        >
          <div></div>
        </Can>
      </div>
    </>
  );
}