/**
 * Página para criação da primeira equipe
 * Parte obrigatória do fluxo pós-cadastro
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useTeams } from '@/lib/contexts/TeamContext';

const createTeamSchema = z.object({
  name: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(50, 'Nome deve ter no máximo 50 caracteres')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Nome contém caracteres inválidos'),
});

type CreateTeamFormData = z.infer<typeof createTeamSchema>;

/**
 * Página de criação da primeira equipe
 */
export default function CreateTeamPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createTeam } = useTeams();

  const form = useForm<CreateTeamFormData>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (data: CreateTeamFormData) => {
    setIsLoading(true);
    
    try {
      await createTeam(data.name);
      
      toast({
        title: 'Equipe criada com sucesso!',
        description: `"${data.name}" foi criada e você é o proprietário.`,
      });

      // Redireciona para o dashboard
      navigate('/dashboard');
      
    } catch (error) {
      toast({
        title: 'Erro ao criar equipe',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Criar Equipe - SaaS Core</title>
        <meta name="description" content="Crie sua primeira equipe para começar a colaborar" />
      </Helmet>

      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Crie sua equipe</h1>
              <p className="text-muted-foreground mt-2">
                Para começar, você precisa criar um espaço de trabalho para sua equipe
              </p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da equipe</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da equipe</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Minha Empresa, Equipe de Marketing..."
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      'Criando equipe...'
                    ) : (
                      <>
                        Criar equipe
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Help text */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              Você será o proprietário desta equipe e poderá convidar outros membros depois.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}