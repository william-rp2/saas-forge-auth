/**
 * LoginForm Component
 * 
 * Handles user authentication with:
 * - Email/password validation
 * - Google OAuth integration
 * - Error handling and loading states
 * - Responsive design
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import { toast } from '@/hooks/use-toast';

import { GoogleButton } from '@/components/shared/GoogleButton';
import { FormDivider } from '@/components/shared/FormDivider';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { authApi } from '@/lib/auth';

/**
 * Login form component with validation and authentication
 */
export const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      
      const response = await authApi.login(data);
      
      if (response.success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Você será redirecionado para o dashboard.',
        });
        
        // TODO: Store user data and token
        // TODO: Update auth context
        
        // Navigate to dashboard (placeholder)
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google authentication
   */
  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);
      
      const response = await authApi.googleLogin();
      
      if (response.success) {
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Você será redirecionado para o dashboard.',
        });
        
        // TODO: Store user data and token
        // TODO: Update auth context
        
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Google Login Button */}
      <GoogleButton
        onClick={handleGoogleLogin}
        isLoading={isGoogleLoading}
        disabled={isLoading}
      >
        Entrar com Google
      </GoogleButton>

      <FormDivider />

      {/* Email/Password Form */}
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

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Sua senha"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
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

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link
              to="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Esqueci minha senha
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isGoogleLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Entrar
          </Button>
        </form>
      </Form>

      {/* Sign Up Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">Não tem uma conta? </span>
        <Link
          to="/auth/signup"
          className="text-primary hover:underline font-medium"
        >
          Cadastre-se
        </Link>
      </div>
    </div>
  );
};