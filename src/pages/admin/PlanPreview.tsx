import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import PlanFormPreview from '@/components/features/plans/PlanFormPreview';

/**
 * Página de criação e edição de planos
 */
export default function PlanPreviewPage() {
  return (
    <>
      <Helmet>
        <title>Detalhes do plano - Administração</title>
        <meta name="description" content={'Visualize as configurações do plano'} />
      </Helmet>

      <PlanFormPreview />
    </>
  );
}