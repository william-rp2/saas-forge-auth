/**
 * Layout para as páginas de configurações de equipe
 * Fornece navegação e estrutura comum para gerenciamento de equipe
 */

import { Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Users, UserPlus, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTeams } from '@/lib/contexts/TeamContext';

/**
 * Layout principal para as configurações de equipe
 */
export default function TeamLayout() {
  const location = useLocation();
  const { currentTeam } = useTeams();
  
  const currentTab = location.pathname.includes('/members') ? 'members' : 
                    location.pathname.includes('/invitations') ? 'invitations' : 'members';

  return (
    <>
      <Helmet>
        <title>Configurações da Equipe - {currentTeam?.name || 'SaaS Core'}</title>
        <meta name="description" content="Gerencie membros e configurações da sua equipe" />
      </Helmet>

      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Configurações da Equipe</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie membros, convites e configurações de{' '}
            <span className="font-medium">{currentTeam?.name}</span>
          </p>
        </div>

        {/* Navigation Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Gerenciamento de Equipe</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={currentTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger 
                  value="members" 
                  className="flex items-center space-x-2"
                  onClick={() => window.location.href = '/settings/team/members'}
                >
                  <Users className="w-4 h-4" />
                  <span>Membros</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="invitations" 
                  className="flex items-center space-x-2"
                  onClick={() => window.location.href = '/settings/team/invitations'}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Convites</span>
                </TabsTrigger>
              </TabsList>

              {/* Content Area */}
              <div className="mt-6">
                <Outlet />
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  );
}