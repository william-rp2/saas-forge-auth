import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import PlanForm from '@/components/features/plans/PlanForm';

/**
 * Página de criação e edição de planos
 */
export default function PlanEditPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== 'new';

  return (
    <>
      <Helmet>
        <title>{isEditing ? 'Editar Plano' : 'Criar Plano'} - Administração</title>
        <meta name="description" content={isEditing ? 'Edite as configurações do plano' : 'Crie um novo plano de assinatura'} />
      </Helmet>

      <PlanForm />
    </>
  );
}