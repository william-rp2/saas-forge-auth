/**
 * DataTable para exibir e gerenciar membros da equipe
 */

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Crown, Shield, User } from 'lucide-react';
import { useTeamMembers } from '@/lib/hooks/useTeams';
import { useToast } from '@/hooks/use-toast';
import { mockDb } from '@/mocks/db';

interface MemberWithUser {
  userId: string;
  userName: string;
  userEmail: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
}

/**
 * Tabela de membros da equipe com ações de gerenciamento
 */
export default function MembersDataTable() {
  const [removingMember, setRemovingMember] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    members, 
    updateMemberRole, 
    removeMember,
    canManageMembers,
    canRemoveMembers 
  } = useTeamMembers();
  
  const { toast } = useToast();

  // Enriquece os dados dos membros com informações do usuário
  const membersWithUserData: MemberWithUser[] = members.map(member => {
    const user = mockDb.findUserById(member.userId);
    return {
      userId: member.userId,
      userName: user?.name || 'Usuário Desconhecido',
      userEmail: user?.email || '',
      role: member.role,
      joinedAt: member.joinedAt,
    };
  });

  const handleRoleChange = async (userId: string, newRole: 'ADMIN' | 'MEMBER') => {
    setIsLoading(true);
    
    try {
      await updateMemberRole(userId, newRole);
      
      toast({
        title: 'Perfil atualizado',
        description: `Perfil do membro foi alterado para ${newRole === 'ADMIN' ? 'Administrador' : 'Membro'}.`,
      });
    } catch (error) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setIsLoading(true);
    
    try {
      await removeMember(userId);
      
      toast({
        title: 'Membro removido',
        description: 'O membro foi removido da equipe.',
      });
      
      setRemovingMember(null);
    } catch (error) {
      toast({
        title: 'Erro ao remover membro',
        description: 'Tente novamente em alguns instantes.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'ADMIN':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'Proprietário';
      case 'ADMIN':
        return 'Administrador';
      default:
        return 'Membro';
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'default' as const;
      case 'ADMIN':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  if (membersWithUserData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum membro encontrado</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Membros da Equipe ({membersWithUserData.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Membro</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Ingressou em</TableHead>
                {(canManageMembers || canRemoveMembers) && (
                  <TableHead className="text-right">Ações</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersWithUserData.map((member) => (
                <TableRow key={member.userId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {member.userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{member.userName}</div>
                        <div className="text-sm text-muted-foreground">{member.userEmail}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center space-x-1 w-fit">
                      {getRoleIcon(member.role)}
                      <span>{getRoleText(member.role)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  {(canManageMembers || canRemoveMembers) && (
                    <TableCell className="text-right">
                      {member.role !== 'OWNER' && member.userId !== '1' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" disabled={isLoading}>
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border border-border">
                            {canManageMembers && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => handleRoleChange(member.userId, 'ADMIN')}
                                  disabled={member.role === 'ADMIN'}
                                >
                                  <Shield className="mr-2 h-4 w-4" />
                                  Tornar Administrador
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRoleChange(member.userId, 'MEMBER')}
                                  disabled={member.role === 'MEMBER'}
                                >
                                  <User className="mr-2 h-4 w-4" />
                                  Tornar Membro
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            {canRemoveMembers && (
                              <DropdownMenuItem
                                onClick={() => setRemovingMember(member.userId)}
                                className="text-destructive focus:text-destructive"
                              >
                                Remover da equipe
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de confirmação para remoção */}
      <AlertDialog open={!!removingMember} onOpenChange={() => setRemovingMember(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover membro da equipe</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este membro da equipe? Esta ação não pode ser desfeita.
              O membro perderá acesso a todos os recursos da equipe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => removingMember && handleRemoveMember(removingMember)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remover membro
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}