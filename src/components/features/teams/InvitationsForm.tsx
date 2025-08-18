/**
 * Formulário para convidar novos membros para a equipe
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Send, Clock, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { useTeamInvitations } from '@/lib/hooks/useTeams';

const inviteSchema = z.object({
  email: z.string().email('E-mail inválido'),
  role: z.literal('ADMIN').or(z.literal('MEMBER')),
});

type InviteFormData = z.infer<typeof inviteSchema>;

/**
 * Formulário para convidar membros e lista de convites pendentes
 */
export default function InvitationsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { 
    pendingInvitations, 
    inviteMember, 
    canSendInvites 
  } = useTeamInvitations();

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
      role: 'MEMBER',
    },
  });

  const onSubmit = async (data: InviteFormData) => {
    setIsLoading(true);
    
    try {
      await inviteMember(data.email, data.role);
      
      toast({
        title: 'Convite enviado!',
        description: `Convite foi enviado para ${data.email}.`,
      });

      form.reset();
    } catch (error) {
      toast({
        title: 'Erro ao enviar convite',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleText = (role: string) => {
    return role === 'ADMIN' ? 'Administrador' : 'Membro';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'ACCEPTED':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'DECLINED':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente';
      case 'ACCEPTED':
        return 'Aceito';
      case 'DECLINED':
        return 'Recusado';
      default:
        return status;
    }
  };

  if (!canSendInvites) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Convidar Membros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Você não tem permissão para enviar convites.</p>
            <p className="text-sm mt-2">Apenas proprietários e administradores podem convidar novos membros.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Formulário de convite */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Convidar Novo Membro</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail do convidado</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="usuario@empresa.com"
                          type="email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Perfil</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o perfil" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MEMBER">Membro</SelectItem>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  'Enviando convite...'
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar convite
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lista de convites pendentes */}
      {pendingInvitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Convites Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Perfil</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Enviado em</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingInvitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getRoleText(invitation.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invitation.status)}
                        <span>{getStatusText(invitation.status)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(invitation.createdAt).toLocaleDateString('pt-BR')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty state para convites */}
      {pendingInvitations.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Convites Pendentes</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <div className="text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum convite pendente</p>
              <p className="text-sm mt-2">Convites enviados aparecerão aqui até serem aceitos ou recusados.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}