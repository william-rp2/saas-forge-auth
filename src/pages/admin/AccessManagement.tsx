/**
 * Access Management Page
 * 
 * Main admin page for managing roles and user permissions (RBAC system).
 */

import { Helmet } from 'react-helmet-async';
import { Shield, Users, Settings } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { RolesManager } from '@/components/features/rbac/RolesManager';
import { UsersManager } from '@/components/features/rbac/UsersManager';
import { Can } from '@/components/shared/Can';

const AccessManagement = () => {
  return (
    <>
      <Helmet>
        <title>Gestão de Acessos - SaaS Core</title>
        <meta name="description" content="Gerencie perfis de usuário e permissões do sistema." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Can action="read" subject="Role" fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
            <p className="text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          </div>
        </div>
      }>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Shield className="w-8 h-8 text-primary" />
                  Gestão de Acessos
                </h1>
                <p className="text-muted-foreground">
                  Gerencie perfis de usuário e suas permissões no sistema
                </p>
              </div>

              <Tabs defaultValue="roles" className="space-y-6">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="roles" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Perfis
                  </TabsTrigger>
                  <TabsTrigger value="users" className="gap-2">
                    <Users className="w-4 h-4" />
                    Usuários
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="roles">
                  <RolesManager />
                </TabsContent>

                <TabsContent value="users">
                  <UsersManager />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Can>
    </>
  );
};

export default AccessManagement;