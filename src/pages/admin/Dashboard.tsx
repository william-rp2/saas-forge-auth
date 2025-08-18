import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react';

/**
 * Dashboard administrativo com visão geral do sistema
 */
export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total de Usuários',
      value: '2,847',
      change: '+12%',
      icon: Users,
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 45,231',
      change: '+20%',
      icon: DollarSign,
    },
    {
      title: 'Assinantes Ativos',
      value: '1,429',
      change: '+8%',
      icon: CreditCard,
    },
    {
      title: 'Taxa de Atividade',
      value: '73%',
      change: '+2%',
      icon: Activity,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard - Administração</title>
        <meta name="description" content="Dashboard administrativo com visão geral do sistema" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral das métricas do sistema
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">{stat.change}</span> em relação ao mês anterior
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                Últimas ações realizadas no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Novo usuário cadastrado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      João Silva se registrou no plano Pro
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Há 2 min</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Plano atualizado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Maria Santos migrou para o plano Enterprise
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Há 15 min</div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Nova feature ativada
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Relatórios avançados habilitados para o plano Pro
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Há 1h</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Distribuição de Planos</CardTitle>
              <CardDescription>
                Porcentagem de usuários por plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Free</p>
                    <p className="text-sm text-muted-foreground">45%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Pro</p>
                    <p className="text-sm text-muted-foreground">35%</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">Enterprise</p>
                    <p className="text-sm text-muted-foreground">20%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}