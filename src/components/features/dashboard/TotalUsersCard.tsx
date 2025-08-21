import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';

interface TotalUsersCardProps {
  totalUsers: number;
  loading?: boolean;
}

export function TotalUsersCard({ totalUsers, loading = false }: TotalUsersCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total de Usuários
        </CardTitle>
        <UserCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          ) : (
            totalUsers.toLocaleString('pt-BR')
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Usuários registrados
        </p>
      </CardContent>
    </Card>
  );
}