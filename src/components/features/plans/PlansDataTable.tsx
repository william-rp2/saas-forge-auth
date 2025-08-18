import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Plus, Edit, Trash2 } from 'lucide-react';
import { mockDb, MockPlan } from '@/mocks/db';
import { useToast } from '@/hooks/use-toast';

/**
 * Componente da tabela de dados para gerenciamento de planos
 * Exibe lista de planos com ações de edição e exclusão
 */
export default function PlansDataTable() {
  const [plans, setPlans] = useState<MockPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setIsLoading(true);
    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 500));
      const plansData = mockDb.getAllPlans();
      setPlans(plansData);
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os planos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const success = mockDb.deletePlan(planId);
      if (success) {
        toast({
          title: 'Sucesso',
          description: 'Plano excluído com sucesso.',
        });
        loadPlans();
      } else {
        throw new Error('Falha ao excluir plano');
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o plano.',
        variant: 'destructive',
      });
    }
  };

  const formatPrice = (price: number, priceDescription: string) => {
    if (price === 0) return 'Gratuito';
    return `R$ ${price.toFixed(2)}${priceDescription}`;
  };

  const getPlanBadgeVariant = (planName: string) => {
    switch (planName.toLowerCase()) {
      case 'free':
        return 'secondary';
      case 'pro':
        return 'default';
      case 'enterprise':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando planos...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Planos de Assinatura</CardTitle>
          <CardDescription>
            Gerencie os planos disponíveis e suas configurações
          </CardDescription>
        </div>
        <Button onClick={() => navigate('/admin/plans/edit/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Criar Novo Plano
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Plano</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Nenhum plano encontrado
                </TableCell>
              </TableRow>
            ) : (
              plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {plan.name}
                      <Badge variant={getPlanBadgeVariant(plan.name)}>
                        {plan.name}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatPrice(plan.price, plan.priceDescription)}
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {plan.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">Ativo</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => navigate(`/admin/plans/edit/${plan.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeletePlan(plan.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}