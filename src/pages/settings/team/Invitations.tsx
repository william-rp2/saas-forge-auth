import { Helmet } from 'react-helmet-async';
import InvitationsForm from '@/components/features/teams/InvitationsForm';

export default function TeamInvitationsPage() {
  return (
    <>
      <Helmet>
        <title>Convites da Equipe - Configurações</title>
        <meta name="description" content="Convide novos membros para sua equipe" />
      </Helmet>
      <InvitationsForm />
    </>
  );
}