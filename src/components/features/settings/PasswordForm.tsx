/**
 * PasswordForm Component
 * 
 * Secure form for changing user password with validation and confirmation.
 * Includes current password verification and security requirements.
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Shield, Lock, Check } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { UsersRepository } from '@/lib/repository/users-respository';
import bcrypt from 'bcryptjs';
import { supabase } from '@/integrations/supabase/client';

/**
 * Password validation schema with security requirements
 */
const passwordSchema = z.object({
  currentPassword: z.string()
    .min(1, 'Senha atual é obrigatória'),
  newPassword: z.string()
    .min(8, 'Nova senha deve ter pelo menos 8 caracteres')
    .regex(/[a-z]/, 'Deve conter pelo menos uma letra minúscula')
    .regex(/[A-Z]/, 'Deve conter pelo menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter pelo menos um número')
    .regex(/[^a-zA-Z0-9]/, 'Deve conter pelo menos um caractere especial'),
  confirmPassword: z.string()
    .min(1, 'Confirmação de senha é obrigatória'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type PasswordFormData = z.infer<typeof passwordSchema>;

/**
 * Password strength indicator component
 */
const PasswordStrength = ({ password }: { password: string }) => {
  const requirements = [
    { label: 'Pelo menos 8 caracteres', test: (p: string) => p.length >= 8 },
    { label: 'Uma letra minúscula', test: (p: string) => /[a-z]/.test(p) },
    { label: 'Uma letra maiúscula', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Um número', test: (p: string) => /[0-9]/.test(p) },
    { label: 'Um caractere especial', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
  ];

  const metRequirements = requirements.filter(req => req.test(password)).length;
  const strengthPercentage = (metRequirements / requirements.length) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Força da senha:</span>
        <div className="flex-1 bg-muted rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              strengthPercentage < 40 ? 'bg-destructive' :
              strengthPercentage < 80 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${strengthPercentage}%` }}
          />
        </div>
      </div>
      <ul className="text-sm space-y-1">
        {requirements.map((req, index) => (
          <li 
            key={index} 
            className={`flex items-center gap-2 ${
              req.test(password) ? 'text-green-600' : 'text-muted-foreground'
            }`}
          >
            <Check className={`w-3 h-3 ${req.test(password) ? 'opacity-100' : 'opacity-30'}`} />
            {req.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

interface PasswordFormProps {
  /** Optional callback when password is successfully changed */
  onPasswordChange?: () => void;
}

/**
 * PasswordForm component for changing user password
 * 
 * @example
 * ```tsx
 * <PasswordForm onPasswordChange={() => console.log('Password changed!')} />
 * ```
 */
export const PasswordForm = ({ onPasswordChange }: PasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { watch, reset, setError } = form;
  const newPassword = watch('newPassword');

  const { email } = JSON.parse(localStorage.getItem("logged_data"));
  const user = React.useRef(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await supabase.auth.getUser();

      const isGoogleProvider: boolean = data.user.app_metadata.provider === "google";
      setIsFormDisabled(isGoogleProvider);

      //- O usuário se cadastrou na plataforma com e-mail e senha
      const userFounded = await UsersRepository.findByEmail(email);
      user.current = { actualPass: userFounded.password }
    }

    fetchUser();
  }, [email]);

  /**
   * Toggle password visibility for specific field
   */
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  /**
   * Handle form submission with password validation
   */
  const handleSubmit = async (data: PasswordFormData) => {
    setIsLoading(true);

    try {
      const password: string = form.getValues("newPassword");
      const passwordHash: string = await bcrypt.hash(password, 10);
      const {data, error} = await supabase.auth.updateUser({ password: passwordHash });
      const { id } = JSON.parse(localStorage.getItem("logged_data"));
      await UsersRepository.update(id, { password: passwordHash });

      if (error) {
        console.error("Erro ao atualizar a senha.", error);
        throw new Error("Erro ao atualizar a senha");
      } else {
        reset();
        toast({ title: "Senha alterada!", description: "Sua senha foi alterada com sucesso." });
        onPasswordChange?.();
      }
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: "Ocorreu um erro ao alterar sua senha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Valida a senha atual do usuário
   */
  const validateActualPassword = async () => {
    const password: string = form.getValues("currentPassword");
    const match: boolean = await bcrypt.compare(password, user.current.actualPass);

    if (!match) toast({ description: "A senha está incorreta", variant: "destructive" });
  }

  /**
   * Valida a nova senha do usuário
   * Ela não pode ser igual a senha antiga
   * Deve ter pelo menos 8 caracteres
   * Deve ter pelo menos 1 número
   * Deve ter pelo menos 1 letra maíuscula
   * Deve ter pelo menos 1 letra minúscula
   * Deve ter pelo menos 1 caractere especial (@#$%...)
   */
  const validatePassword = async () => {
    const newPass: string = form.getValues("newPassword");
    const match: boolean = await bcrypt.compare(newPass, user.current.actualPass);

    if (match) toast({ description: "A senha atual não pode ser igual à senha antiga", variant: "destructive"});
  }

  const validateConfirmationPassword = async () => {
    const newPassword: string = form.getValues("newPassword");
    const confirmationPassword: string = form.getValues("confirmPassword");

    if (confirmationPassword !== newPassword) toast({ description: "As senhas não são iguais, por favor verifique e tente novamente", variant: "destructive"});
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Segurança</h2>
        <p className="text-muted-foreground">
          Altere sua senha para manter sua conta segura.
        </p>

        { isFormDisabled ? <p><b>Usuários cadastrados diretamente com a Conta Google, por segurança não podem realizar alteração de senha.</b></p> : "" }
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Password Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Alterar Senha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Atual</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.current ? "text" : "password"}
                            placeholder="Digite sua senha atual"
                            {...field}
                            onBlur={() => validateActualPassword()}
                            disabled={ isFormDisabled }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('current')}
                          >
                            {showPasswords.current ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.new ? "text" : "password"}
                            placeholder="Digite sua nova senha"
                            {...field}
                            onKeyUp={() => validatePassword()}
                            disabled={ isFormDisabled }
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('new')}
                          >
                            {showPasswords.new ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPasswords.confirm ? "text" : "password"}
                            placeholder="Confirme sua nova senha"
                            {...field}
                            disabled={ isFormDisabled }
                            onBlur={() => validateConfirmationPassword()}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => togglePasswordVisibility('confirm')}
                          >
                            {showPasswords.confirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isFormDisabled }
                >
                  {isLoading ? "Alterando..." : "Alterar Senha"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Password Strength */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Requisitos de Segurança
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PasswordStrength password={newPassword || ''} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};