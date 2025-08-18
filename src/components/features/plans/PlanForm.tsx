import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';
import { mockDb, MockFeature, MockLimit } from '@/mocks/db';
import { useToast } from '@/hooks/use-toast';

/**
 * Schema de validação para o formulário de plano
 */
const planFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
  priceDescription: z.string().min(1, 'Descrição do preço é obrigatória'),
  description: z.string().optional(),
  featureIds: z.array(z.string()),
  limits: z.array(z.object({
    limitId: z.string(),
    value: z.number(),
  })),
});

type PlanFormData = z.infer<typeof planFormSchema>;

/**
 * Componente de formulário para criação e edição de planos
 */
export default function PlanForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = id !== 'new';

  const [features, setFeatures] = useState<MockFeature[]>([]);
  const [limits, setLimits] = useState<MockLimit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PlanFormData>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      name: '',
      price: 0,
      priceDescription: '/mês',
      description: '',
      featureIds: [],
      limits: [],
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Carrega features e limits disponíveis
      const featuresData = mockDb.getAllFeatures();
      const limitsData = mockDb.getAllLimits();
      setFeatures(featuresData);
      setLimits(limitsData);

      // Se estiver editando, carrega os dados do plano
      if (isEditing && id) {
        const plan = mockDb.findPlanById(id);
        if (plan) {
          const planFeatures = mockDb.getPlanFeatures(id);
          const planLimits = mockDb.getPlanLimits(id);

          form.reset({
            name: plan.name,
            price: plan.price,
            priceDescription: plan.priceDescription,
            description: plan.description || '',
            featureIds: planFeatures.map(f => f.id),
            limits: planLimits.map(l => ({
              limitId: l.id,
              value: l.value,
            })),
          });
        }
      } else {
        // Para novo plano, inicializa os limits com valor 0
        form.setValue(
          'limits',
          limitsData.map(limit => ({
            limitId: limit.id,
            value: 0,
          }))
        );
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PlanFormData) => {
    try {
      if (isEditing && id) {
        // Atualiza plano existente
        mockDb.updatePlan(id, {
          name: data.name,
          price: data.price,
          priceDescription: data.priceDescription,
          description: data.description,
        });
        
        // Atualiza features e limits
        mockDb.updatePlanFeatures(id, data.featureIds);
        mockDb.updatePlanLimits(id, data.limits);
        
        toast({
          title: 'Sucesso',
          description: 'Plano atualizado com sucesso.',
        });
      } else {
        // Cria novo plano
        const newPlan = mockDb.createPlan({
          name: data.name,
          price: data.price,
          priceDescription: data.priceDescription,
          description: data.description,
        });
        
        // Adiciona features e limits
        mockDb.updatePlanFeatures(newPlan.id, data.featureIds);
        mockDb.updatePlanLimits(newPlan.id, data.limits);
        
        toast({
          title: 'Sucesso',
          description: 'Plano criado com sucesso.',
        });
      }
      
      navigate('/admin/plans');
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o plano.',
        variant: 'destructive',
      });
    }
  };

  const getLimitValue = (limitId: string): number => {
    const limits = form.watch('limits');
    const limit = limits.find(l => l.limitId === limitId);
    return limit?.value || 0;
  };

  const updateLimitValue = (limitId: string, value: number) => {
    const currentLimits = form.getValues('limits');
    const updatedLimits = currentLimits.map(l => 
      l.limitId === limitId ? { ...l, value } : l
    );
    form.setValue('limits', updatedLimits);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carregando...</CardTitle>
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin/plans')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Editar Plano' : 'Criar Novo Plano'}
          </h1>
          <p className="text-muted-foreground">
            {isEditing 
              ? 'Modifique as configurações do plano' 
              : 'Configure um novo plano de assinatura'
            }
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>
                Configure os dados principais do plano
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Plano</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Pro, Enterprise..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Período</FormLabel>
                      <FormControl>
                        <Input placeholder="/mês, /ano..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva as principais características do plano..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features Habilitadas</CardTitle>
              <CardDescription>
                Selecione quais funcionalidades estarão disponíveis neste plano
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="featureIds"
                render={() => (
                  <FormItem>
                    <div className="space-y-4">
                      {features.map((feature) => (
                        <FormField
                          key={feature.id}
                          control={form.control}
                          name="featureIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={feature.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, feature.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== feature.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="text-sm font-medium">
                                    {feature.name}
                                  </FormLabel>
                                  <FormDescription>
                                    {feature.description}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limites de Uso</CardTitle>
              <CardDescription>
                Defina os limites quantitativos para este plano (use -1 para ilimitado)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {limits.map((limit) => (
                <div key={limit.id} className="space-y-2">
                  <Label className="text-sm font-medium">{limit.name}</Label>
                  <p className="text-xs text-muted-foreground">{limit.description}</p>
                  <Input
                    type="number"
                    value={getLimitValue(limit.id)}
                    onChange={(e) => updateLimitValue(limit.id, parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/admin/plans')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              {isEditing ? 'Atualizar Plano' : 'Criar Plano'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}