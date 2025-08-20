/**
 * ProfileForm Component - Formulário de perfil do usuário
 * 
 * Agora integrado com o sistema de Storage para upload de foto de perfil.
 * Utiliza o componente genérico <Uploader> para gerenciar uploads de avatar.
 */

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Uploader, UploaderFile } from '@/components/shared/Uploader';
import { mockDb } from '@/mocks/db';

const profileSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  bio: z.string().optional(),
  company: z.string().optional(),
  website: z.string().url('URL inválida').optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

/**
 * Formulário de perfil integrado com Storage
 */
export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Busca dados do usuário mockado
  const currentUser = mockDb.findUserById('1'); // Mock user ID
  const currentProfile = mockDb.findProfileByUserId('1');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      bio: currentProfile?.bio || '',
      company: currentProfile?.company || '',
      website: currentProfile?.website || '',
    },
  });

  /**
   * Manipula o upload do avatar
   */
  const handleAvatarUpload = (files: UploaderFile[]) => {
    if (files.length > 0) {
      const uploadedFile = files[0];
      setAvatarUrl(uploadedFile.url);
      
      // Atualiza o usuário mockado com a nova URL do avatar
      if (currentUser) {
        mockDb.updateUser(currentUser.id, {
          avatarUrl: uploadedFile.url,
        });
      }

      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi atualizada com sucesso.",
      });
    }
  };

  /**
   * Submissão do formulário
   */
  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);

    try {
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Atualiza dados do usuário mockado
      if (currentUser) {
        mockDb.updateUser(currentUser.id, {
          name: data.name,
          email: data.email,
        });
      }

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });

    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Foto de Perfil</CardTitle>
          <CardDescription>
            Sua foto de perfil será exibida em todo o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage 
                src={avatarUrl || currentUser?.avatarUrl} 
                alt={currentUser?.name} 
              />
              <AvatarFallback className="text-lg">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Alterar foto</p>
              <Uploader
                path="avatars/"
                accept="image/jpeg,image/png,image/webp"
                maxFiles={1}
                maxFileSize={5 * 1024 * 1024} // 5MB
                onUploadComplete={handleAvatarUpload}
                className="min-h-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize suas informações de perfil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  disabled={isLoading}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register('email')}
                  disabled={isLoading}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Biografia</Label>
              <Textarea
                id="bio"
                placeholder="Conte um pouco sobre você..."
                {...form.register('bio')}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <Input
                  id="company"
                  placeholder="Nome da sua empresa"
                  {...form.register('company')}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  placeholder="https://seusite.com"
                  {...form.register('website')}
                  disabled={isLoading}
                />
                {form.formState.errors.website && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.website.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}