import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TotalTeamsCard } from '@/components/features/dashboard/TotalTeamsCard';
import { TotalUsersCard } from '@/components/features/dashboard/TotalUsersCard';
import { PlanDistributionChart } from '@/components/features/dashboard/PlanDistributionChart';
import { NewTeamsChart } from '@/components/features/dashboard/NewTeamsChart';
import { useDashboardData } from '@/hooks/useDashboardData';
import { AlertCircle, RefreshCw } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { data: stats, loading, error, refetch } = useDashboardData();

  // Handle error state
  if (error) {
    return (
      <>
        <Helmet>
          <title>Dashboard - Administração</title>
        </Helmet>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
            <button
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar Novamente
            </button>
          </div>
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center gap-3 p-6">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">Erro ao carregar dados</h3>
                <p className="text-red-600">{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Administração</title>
        <meta name="description" content="Dashboard administrativo com visão geral do sistema" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Visão geral das métricas do sistema
            </p>
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <TotalUsersCard totalUsers={stats?.totalUsers} loading={loading} />
          <TotalTeamsCard totalTeams={stats?.totalTeams} loading={loading} />
          
          {/* Revenue Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita Mensal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats?.revenueStats?.monthly || 'R$ 0,00'}
              </div>
              <p className="text-xs text-muted-foreground">
                Receita recorrente mensal
              </p>
            </CardContent>
          </Card>

          {/* Active Subscribers Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Assinantes Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats?.revenueStats?.activeSubscribers || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Usuários com planos pagos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4">
            <NewTeamsChart 
              data={stats?.weeklyTeams || []} 
              loading={loading} 
            />
          </div>
          
          <div className="col-span-3">
            <PlanDistributionChart 
              data={stats?.planDistribution || []} 
              loading={loading} 
            />
          </div>
        </div>

        {/* Activity Rate Card */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Atividade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600">
                {loading ? '...' : stats?.revenueStats?.activityRate || '0%'}
              </div>
              <p className="text-muted-foreground mt-2">
                Percentual de usuários ativos na plataforma
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;