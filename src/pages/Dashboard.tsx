/**
 * Dashboard Page
 * 
 * Centro de controle principal do SaaS Core:
 * - Acesso rápido a todos os módulos
 * - Visão geral das métricas do usuário
 * - Navegação intuitiva entre funcionalidades
 * - Informações do plano atual com entitlements
 */

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield, 
  CreditCard, 
  LayoutDashboard,
  UserCircle,
  Lock,
  Palette,
  ArrowRight,
  Crown
} from 'lucide-react';
import { useEntitlements } from '@/lib/hooks/useEntitlements';

/**
 * Dashboard page component - Central hub do SaaS Core
 */
const Dashboard = () => {
  const { currentPlan, getLimit, can } = useEntitlements();

  // Dados mockados para demonstração
  const stats = {
    projects: 3,
    projectsLimit: getLimit('max-projects'),
    apiUsage: 1234,
    apiLimit: getLimit('max-api-calls'),
    storage: 2.4,
    storageLimit: getLimit('max-storage'),
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - SaaS Core</title>
        <meta 
          name="description" 
          content="Acesse seu dashboard do SaaS Core. Gerencie seus projetos, configurações e administração." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold text-foreground">SaaS Core</h1>
              {currentPlan && (
                <Badge variant="secondary">
                  {currentPlan.name}
                </Badge>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings/profile">
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/settings">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Link>
              </Button>
              <Button variant="ghost" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Bem-vindo ao SaaS Core
              </h2>
              <p className="text-muted-foreground">
                Gerencie todos os aspectos da sua aplicação através do seu centro de controle.
              </p>
            </div>

            {/* Quick Actions - Módulos Principais */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Módulos do Sistema</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Administração */}
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <Link to="/admin/dashboard" className="block p-6">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                          <LayoutDashboard className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Administração</CardTitle>
                          <p className="text-sm text-muted-foreground">Centro administrativo</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Acesse o painel administrativo completo com gestão de usuários, planos e permissões.
                      </p>
                      <div className="flex items-center text-sm text-primary group-hover:text-primary/80">
                        Acessar módulo
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                {/* Gestão de Acessos (RBAC) */}
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <Link to="/admin/access-management" className="block p-6">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Gestão de Acessos</CardTitle>
                          <p className="text-sm text-muted-foreground">Sistema RBAC</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Gerencie perfis, permissões e controle de acesso baseado em funções.
                      </p>
                      <div className="flex items-center text-sm text-primary group-hover:text-primary/80">
                        Gerenciar acessos
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>

                {/* Planos e Permissões */}
                <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
                  <Link to="/admin/plans" className="block p-6">
                    <CardHeader className="p-0 pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                          <CreditCard className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Planos e Permissões</CardTitle>
                          <p className="text-sm text-muted-foreground">Sistema de monetização</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <p className="text-sm text-muted-foreground mb-3">
                        Configure planos de assinatura, features e limites de uso.
                      </p>
                      <div className="flex items-center text-sm text-primary group-hover:text-primary/80">
                        Gerenciar planos
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </div>
            </div>

            {/* Configurações do Usuário */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Configurações da Conta</h3>
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                  <Link to="/settings/profile" className="block p-4">
                    <div className="flex items-center space-x-3">
                      <UserCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <h4 className="font-medium">Perfil</h4>
                        <p className="text-xs text-muted-foreground">Dados pessoais</p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform text-muted-foreground" />
                    </div>
                  </Link>
                </Card>

                <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                  <Link to="/settings/security" className="block p-4">
                    <div className="flex items-center space-x-3">
                      <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <div>
                        <h4 className="font-medium">Segurança</h4>
                        <p className="text-xs text-muted-foreground">Senha e autenticação</p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform text-muted-foreground" />
                    </div>
                  </Link>
                </Card>

                <Card className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                  <Link to="/settings/preferences" className="block p-4">
                    <div className="flex items-center space-x-3">
                      <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                      <div>
                        <h4 className="font-medium">Preferências</h4>
                        <p className="text-xs text-muted-foreground">Tema e notificações</p>
                      </div>
                      <ArrowRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform text-muted-foreground" />
                    </div>
                  </Link>
                </Card>
              </div>
            </div>

            {/* Stats Cards com dados do plano */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Uso Atual</h3>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Projetos Ativos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.projects}</div>
                    <p className="text-xs text-muted-foreground">
                      de {stats.projectsLimit === -1 ? '∞' : stats.projectsLimit} disponíveis
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Plano Atual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{currentPlan?.name || 'Free'}</div>
                    <p className="text-xs text-muted-foreground">
                      R$ {currentPlan?.price || 0}{currentPlan?.priceDescription || '/mês'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Uso de API
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.apiUsage.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                      de {stats.apiLimit === -1 ? '∞' : stats.apiLimit.toLocaleString()} chamadas
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Armazenamento
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.storage}GB</div>
                    <p className="text-xs text-muted-foreground">
                      de {stats.storageLimit}GB disponíveis
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Features disponíveis no plano atual */}
            {currentPlan && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Crown className="w-5 h-5 text-primary" />
                    <span>Features do seu plano {currentPlan.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {can('advanced-reports') && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Relatórios Avançados</span>
                      </div>
                    )}
                    {can('api-access') && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Acesso à API</span>
                      </div>
                    )}
                    {can('priority-support') && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Suporte Prioritário</span>
                      </div>
                    )}
                    {can('custom-branding') && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Marca Personalizada</span>
                      </div>
                    )}
                    {can('unlimited-exports') && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-sm">Exportações Ilimitadas</span>
                      </div>
                    )}
                    {!can('advanced-reports') && !can('api-access') && !can('priority-support') && (
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                        <span className="text-sm text-muted-foreground">Plano básico - Upgrade para mais features</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;