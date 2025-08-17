/**
 * UsersManager Component
 * 
 * Manages user role assignments in the RBAC system.
 * Allows administrators to view users and change their assigned roles.
 */

import { useState, useEffect } from 'react';
import { User, Shield, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';

import { mockRbac } from '@/mocks/rbac-handlers';
import { MockUser, MockRole } from '@/mocks/db';

interface UserWithRole extends MockUser {
  roleName: string;
  roleColor: string;
}

/**
 * UsersManager component for managing user role assignments
 */
export const UsersManager = () => {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [roles, setRoles] = useState<MockRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  /**
   * Load users and roles
   */
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [usersResponse, rolesResponse] = await Promise.all([
        mockRbac.getUsersWithRoles(),
        mockRbac.getRoles(),
      ]);

      if (usersResponse.success && usersResponse.users) {
        setUsers(usersResponse.users);
      }

      if (rolesResponse.success && rolesResponse.roles) {
        setRoles(rolesResponse.roles);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar dados',
        description: 'Ocorreu um erro inesperado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user role update
   */
  const handleRoleUpdate = async (userId: string, newRoleId: string) => {
    try {
      setUpdatingUserId(userId);
      
      const response = await mockRbac.updateUserRole(userId, newRoleId);
      
      if (response.success) {
        toast({
          title: 'Perfil atualizado',
          description: response.message,
        });
        
        await loadData(); // Reload to get updated role information
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro',
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Ocorreu um erro inesperado.',
      });
    } finally {
      setUpdatingUserId(null);
    }
  };

  /**
   * Get user initials for avatar
   */
  const getUserInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  /**
   * Format creation date
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Gerenciamento de Usuários
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Visualize e altere os perfis dos usuários
        </p>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Carregando usuários...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Perfil Atual</TableHead>
                  <TableHead>Membro desde</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-muted-foreground">{user.email}</span>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.selectedPlan}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className="gap-1"
                        style={{ 
                          backgroundColor: `${user.roleColor}20`,
                          color: user.roleColor,
                          borderColor: `${user.roleColor}40`
                        }}
                      >
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: user.roleColor }}
                        />
                        {user.roleName}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <span className="text-muted-foreground">
                        {formatDate(user.createdAt)}
                      </span>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-1"
                            disabled={updatingUserId === user.id}
                          >
                            <Shield className="w-3 h-3" />
                            Alterar Perfil
                            <ChevronDown className="w-3 h-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Selecionar Perfil</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          {roles.map((role) => (
                            <DropdownMenuItem
                              key={role.id}
                              onClick={() => handleRoleUpdate(user.id, role.id)}
                              disabled={role.id === user.roleId}
                              className="gap-2"
                            >
                              <div
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: role.color }}
                              />
                              <span>{role.name}</span>
                              {role.id === user.roleId && (
                                <Badge variant="secondary" className="ml-auto text-xs">
                                  Atual
                                </Badge>
                              )}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {users.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium">Nenhum usuário encontrado</h3>
              <p className="text-muted-foreground">
                Os usuários aparecerão aqui quando se cadastrarem no sistema.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};