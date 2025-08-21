import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface TotalTeamsCardProps {
  totalTeams: number;
  loading?: boolean;
}

export function TotalTeamsCard({ totalTeams, loading = false }: TotalTeamsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Total de Equipes
        </CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 bg-muted animate-pulse rounded" />
          ) : (
            totalTeams.toLocaleString('pt-BR')
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Equipes ativas na plataforma
        </p>
      </CardContent>
    </Card>
  );
}