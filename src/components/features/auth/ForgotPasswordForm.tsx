/**
 * ForgotPasswordForm Component
 * 
 * Handles password recovery with:
 * - Email validation
 * - Security-focused messaging
 * - Loading states
 * - Navigation back to login
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';

import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { authApi } from '@/lib/auth';

/**
 * Password recovery form component
 */
export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      
      const response = await authApi.forgotPassword(data.email);
      
      if (response.success) {
        setIsSubmitted(true);
        toast({
          title: 'E-mail enviado!',
          description: response.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro ao enviar e-mail',
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar e-mail',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto bg-success/10 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-success" />
        </div>

        {/* Success Message */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            E-mail enviado!
          </h3>
          <p className="text-muted-foreground">
            Se um usuário com este e-mail existir, um link de recuperação será enviado.
          </p>
        </div>

        {/* Instructions */}
        <div className="p-4 bg-muted/50 rounded-lg text-left space-y-2">
          <h4 className="font-medium text-sm text-foreground">
            Próximos passos:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Verifique sua caixa de entrada</li>
            <li>• Procure também na pasta de spam</li>
            <li>• Clique no link para redefinir sua senha</li>
            <li>• O link expira em 1 hora</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
            }}
            variant="outline"
            className="w-full"
          >
            Enviar novamente
          </Button>
          
          <Link to="/auth/login">
            <Button variant="ghost" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para o login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-foreground">
          Recuperar senha
        </h3>
        <p className="text-muted-foreground">
          Digite seu e-mail para receber um link de recuperação
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="seu@email.com"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar link de recuperação
          </Button>
        </form>
      </Form>

      {/* Security Notice */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-foreground mb-1">
              Segurança em primeiro lugar
            </p>
            <p className="text-muted-foreground">
              Por motivos de segurança, sempre informamos que o e-mail foi enviado, 
              independentemente da existência da conta.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Login Link */}
      <div className="text-center">
        <Link
          to="/auth/login"
          className="inline-flex items-center text-sm text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
};