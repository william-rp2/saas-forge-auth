/**
 * RolesManager Component
 * 
 * Manages the CRUD operations for roles in the RBAC system.
 * Allows administrators to create, edit, and delete roles with their permissions.
 */

import { useState, useEffect } from 'react';
import { Plus, Settings, Trash2, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

import { RoleForm } from './RoleForm';
import { mockRbac } from '@/mocks/rbac-handlers';
import { MockRole } from '@/mocks/db';

/**
 * RolesManager component for managing system roles
 */
export const RolesManager = () => {
  const [roles, setRoles] = useState<MockRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<MockRole | null>(null);
  const [showRoleForm, setShowRoleForm] = useState(false);
  const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

  /**
   * Load roles from mock API
   */
  const loadRoles = async () => {
    try {
      setIsLoading(true);
      const response = await mockRbac.getRoles();
      
      if (response.success && response.roles) {
        setRoles(response.roles);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar perfis',
        description: 'Ocorreu um erro inesperado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle role creation/update
   */
  const handleRoleSave = async (roleData: {
    name: string;
    description: string;
    color: string;
    permissionIds: string[];
  }) => {
    try {
      let response;
      
      if (editingRole) {
        response = await mockRbac.updateRole(editingRole.id, roleData);
      } else {
        response = await mockRbac.createRole(roleData);
      }

      if (response.success) {
        toast({
          title: editingRole ? 'Perfil atualizado' : 'Perfil criado',
          description: response.message,
        });
        
        setShowRoleForm(false);
        setEditingRole(null);
        await loadRoles();
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
    }
  };

  /**
   * Handle role deletion
   */
  const handleRoleDelete = async (roleId: string) => {
    try {
      const response = await mockRbac.deleteRole(roleId);
      
      if (response.success) {
        toast({
          title: 'Perfil excluído',
          description: response.message,
        });
        
        await loadRoles();
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir',
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
      setDeletingRoleId(null);
    }
  };

  /**
   * Start editing a role
   */
  const startEditing = (role: MockRole) => {
    setEditingRole(role);
    setShowRoleForm(true);
  };

  /**
   * Start creating a new role
   */
  const startCreating = () => {
    setEditingRole(null);
    setShowRoleForm(true);
  };

  /**
   * Cancel role form
   */
  const cancelRoleForm = () => {
    setShowRoleForm(false);
    setEditingRole(null);
  };

  useEffect(() => {
    loadRoles();
  }, []);

  if (showRoleForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {editingRole ? 'Editar Perfil' : 'Criar Novo Perfil'}
          </h3>
          <Button variant="outline" onClick={cancelRoleForm}>
            Cancelar
          </Button>
        </div>
        
        <RoleForm
          role={editingRole}
          onSave={handleRoleSave}
          onCancel={cancelRoleForm}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-foreground">Perfis de Acesso</h3>
          <p className="text-sm text-muted-foreground">
            Gerencie os perfis e suas permissões
          </p>
        </div>
        <Button onClick={startCreating} className="gap-2">
          <Plus className="w-4 h-4" />
          Criar Novo Perfil
        </Button>
      </div>

      {/* Roles Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Carregando perfis...</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: role.color }}
                      />
                      {role.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {role.description}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Permissions count */}
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {role.permissionIds.length} permissão(ões)
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(role)}
                      className="flex-1 gap-2"
                    >
                      <Settings className="w-3 h-3" />
                      Editar
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                          Excluir
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir o perfil "{role.name}"? 
                            Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleRoleDelete(role.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {roles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Nenhum perfil encontrado</h3>
            <p className="text-muted-foreground">
              Comece criando seu primeiro perfil de acesso.
            </p>
            <Button onClick={startCreating} className="gap-2">
              <Plus className="w-4 h-4" />
              Criar Primeiro Perfil
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};