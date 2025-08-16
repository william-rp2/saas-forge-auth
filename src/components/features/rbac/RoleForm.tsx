/**
 * RoleForm Component
 * 
 * Form for creating and editing roles with permission selection.
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { mockRbac } from '@/mocks/rbac-handlers';
import { MockRole, MockPermission } from '@/mocks/db';

const roleSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  color: z.string().min(1, 'Cor é obrigatória'),
  permissionIds: z.array(z.string()).min(1, 'Selecione pelo menos uma permissão'),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormProps {
  role?: MockRole | null;
  onSave: (data: RoleFormData) => Promise<void>;
  onCancel: () => void;
}

export const RoleForm = ({ role, onSave, onCancel }: RoleFormProps) => {
  const [permissions, setPermissions] = useState<MockPermission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

  const form = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name || '',
      description: role?.description || '',
      color: role?.color || '#3b82f6',
      permissionIds: role?.permissionIds || [],
    },
  });

  const loadPermissions = async () => {
    try {
      const response = await mockRbac.getPermissions();
      if (response.success) {
        setPermissions(response.permissions);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
    } finally {
      setIsLoadingPermissions(false);
    }
  };

  const handleSubmit = async (data: RoleFormData) => {
    setIsLoading(true);
    try {
      await onSave(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions();
  }, []);

  // Group permissions by subject
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.subject]) {
      acc[permission.subject] = [];
    }
    acc[permission.subject].push(permission);
    return acc;
  }, {} as Record<string, MockPermission[]>);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Perfil</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Ex: Administrador" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <FormControl>
                  <Input {...field} type="color" className="h-10" />
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
                <Textarea {...field} placeholder="Descreva as responsabilidades deste perfil" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="permissionIds"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Permissões</FormLabel>
              <div className="space-y-4">
                {Object.entries(groupedPermissions).map(([subject, subjectPermissions]) => (
                  <Card key={subject}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">{subject}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid gap-3 md:grid-cols-2">
                        {subjectPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-start space-x-2">
                            <Checkbox
                              checked={field.value.includes(permission.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, permission.id]);
                                } else {
                                  field.onChange(field.value.filter(id => id !== permission.id));
                                }
                              }}
                            />
                            <div className="space-y-1">
                              <label className="text-sm font-medium cursor-pointer">
                                {permission.name}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <Button type="submit" disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {role ? 'Atualizar' : 'Criar'} Perfil
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};