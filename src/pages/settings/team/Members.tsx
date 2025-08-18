import { Helmet } from 'react-helmet-async';
import MembersDataTable from '@/components/features/teams/MembersDataTable';

export default function TeamMembersPage() {
  return (
    <>
      <Helmet>
        <title>Membros da Equipe - Configurações</title>
        <meta name="description" content="Gerencie os membros da sua equipe" />
      </Helmet>
      <MembersDataTable />
    </>
  );
}