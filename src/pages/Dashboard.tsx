/**
 * Dashboard Page
 * 
 * Placeholder dashboard page for authenticated users:
 * - Welcome message
 * - Basic layout structure
 * - Navigation placeholder
 * - Ready for future development
 */

import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Settings, LogOut } from 'lucide-react';

/**
 * Dashboard page component (placeholder)
 */
const Dashboard = () => {
  return (
    <>
      <Helmet>
        <title>Dashboard - SaaS Core</title>
        <meta 
          name="description" 
          content="Acesse seu dashboard do SaaS Core. Gerencie seus projetos e configurações da conta." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-primary-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-foreground">SaaS Core</h1>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Perfil
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configurações
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
                Bem-vindo ao Dashboard
              </h2>
              <p className="text-muted-foreground">
                Este é o seu painel de controle do SaaS Core. Aqui você poderá gerenciar 
                seus projetos e configurações.
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Projetos Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    +2 desde o mês passado
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
                  <div className="text-2xl font-bold">Pro</div>
                  <p className="text-xs text-muted-foreground">
                    Renovação em 30 dias
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
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">
                    de 10,000 chamadas
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
                  <div className="text-2xl font-bold">2.4GB</div>
                  <p className="text-xs text-muted-foreground">
                    de 10GB disponíveis
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Development Notice */}
            <Card className="border-warning/20 bg-warning/5">
              <CardHeader>
                <CardTitle className="text-warning flex items-center space-x-2">
                  <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                  </div>
                  <span>Em Desenvolvimento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground">
                  Este dashboard é um placeholder. As funcionalidades completas serão 
                  implementadas nas próximas iterações do template SaaS Core.
                </p>
                <div className="mt-4">
                  <Button variant="outline" size="sm">
                    Ver Roadmap
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;