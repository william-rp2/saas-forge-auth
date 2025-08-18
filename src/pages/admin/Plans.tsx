import { Helmet } from 'react-helmet-async';
import PlansDataTable from '@/components/features/plans/PlansDataTable';

/**
 * Página principal de gerenciamento de planos
 * Lista todos os planos disponíveis e permite criar novos
 */
export default function PlansPage() {
  return (
    <>
      <Helmet>
        <title>Planos e Permissões - Administração</title>
        <meta name="description" content="Gerencie planos de assinatura e suas permissões" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Planos e Permissões</h1>
          <p className="text-muted-foreground">
            Gerencie os planos de assinatura, features e limites do sistema
          </p>
        </div>

        <PlansDataTable />
      </div>
    </>
  );
}