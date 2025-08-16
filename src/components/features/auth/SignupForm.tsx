/**
 * SignupForm Component
 * 
 * Multi-step registration form with:
 * - Account creation (email/password)
 * - Plan selection
 * - Terms acceptance
 * - Form validation and error handling
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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
import { PlanCard } from '@/components/shared/PlanCard';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { authApi } from '@/lib/auth';

type SignupStep = 'account' | 'plan' | 'terms';

/**
 * Available subscription plans
 */
const PLANS = [
  {
    id: 'basic' as const,
    name: 'Básico',
    description: 'Perfeito para começar',
    price: { amount: 0, currency: 'R$', period: 'mês' },
    features: [
      { text: 'Até 3 projetos', included: true },
      { text: 'Suporte por email', included: true },
      { text: 'Documentação completa', included: true },
      { text: 'Suporte prioritário', included: false },
      { text: 'Projetos ilimitados', included: false },
    ],
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    description: 'Para profissionais',
    price: { amount: 49, currency: 'R$', period: 'mês' },
    features: [
      { text: 'Projetos ilimitados', included: true },
      { text: 'Suporte prioritário', included: true },
      { text: 'Documentação completa', included: true },
      { text: 'Integrações avançadas', included: true },
      { text: 'API personalizada', included: false },
    ],
    isPopular: true,
  },
  {
    id: 'enterprise' as const,
    name: 'Enterprise',
    description: 'Para grandes equipes',
    price: { amount: 149, currency: 'R$', period: 'mês' },
    features: [
      { text: 'Tudo do Pro', included: true },
      { text: 'API personalizada', included: true },
      { text: 'Suporte dedicado', included: true },
      { text: 'SLA garantido', included: true },
      { text: 'Treinamentos', included: true },
    ],
  },
];

/**
 * Multi-step signup form component
 */
export const SignupForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<SignupStep>('account');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      selectedPlan: 'basic',
      acceptTerms: false,
      acceptPrivacy: false,
    },
  });

  /**
   * Handle form submission
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      
      const response = await authApi.register(data);
      
      if (response.success) {
        toast({
          title: 'Cadastro realizado com sucesso!',
          description: response.message,
        });
        
        // Navigate to login page
        navigate('/auth/login');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google registration
   */
  const handleGoogleSignup = async () => {
    try {
      setIsGoogleLoading(true);
      
      const response = await authApi.googleLogin();
      
      if (response.success) {
        toast({
          title: 'Cadastro realizado com sucesso!',
          description: 'Você será redirecionado para o dashboard.',
        });
        
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: response.message,
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro inesperado. Tente novamente.',
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /**
   * Proceed to next step
   */
  const nextStep = () => {
    if (currentStep === 'account') {
      // Validate account fields before proceeding
      const accountFields = ['fullName', 'email', 'password', 'confirmPassword'] as const;
      const isValid = accountFields.every(field => {
        const fieldState = form.getFieldState(field);
        return !fieldState.invalid;
      });

      if (isValid) {
        setCurrentStep('plan');
      } else {
        // Trigger validation
        accountFields.forEach(field => form.trigger(field));
      }
    } else if (currentStep === 'plan') {
      setCurrentStep('terms');
    }
  };

  /**
   * Go back to previous step
   */
  const prevStep = () => {
    if (currentStep === 'terms') {
      setCurrentStep('plan');
    } else if (currentStep === 'plan') {
      setCurrentStep('account');
    }
  };

  /**
   * Check if can proceed to next step
   */
  const canProceed = () => {
    if (currentStep === 'account') {
      const { fullName, email, password, confirmPassword } = form.getValues();
      return fullName && email && password && confirmPassword;
    }
    return true;
  };

  /**
   * Check if form is valid for submission
   */
  const canSubmit = () => {
    const { acceptTerms, acceptPrivacy } = form.getValues();
    return acceptTerms && acceptPrivacy && !isLoading;
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-2 mb-8">
        {['account', 'plan', 'terms'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep === step
                  ? 'bg-primary text-primary-foreground'
                  : ['account', 'plan', 'terms'].indexOf(currentStep) > index
                  ? 'bg-success text-success-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {index + 1}
            </div>
            {index < 2 && (
              <div
                className={`w-8 h-0.5 mx-2 transition-colors ${
                  ['account', 'plan', 'terms'].indexOf(currentStep) > index
                    ? 'bg-success'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Account Creation */}
          {currentStep === 'account' && (
            <div className="space-y-6">
              {/* Google Signup */}
              <GoogleButton
                onClick={handleGoogleSignup}
                isLoading={isGoogleLoading}
                disabled={isLoading}
              >
                Cadastrar com Google
              </GoogleButton>

              <FormDivider />

              <div className="space-y-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Seu nome completo"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
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

                {/* Password */}
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
                            placeholder="Crie uma senha segura"
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
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirme sua senha"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            disabled={isLoading}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                onClick={nextStep}
                className="w-full"
                disabled={!canProceed()}
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 2: Plan Selection */}
          {currentStep === 'plan' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Escolha seu plano</h3>
                <p className="text-muted-foreground">Selecione o plano que melhor atende suas necessidades</p>
              </div>

              <FormField
                control={form.control}
                name="selectedPlan"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-4 md:grid-cols-3">
                      {PLANS.map((plan) => (
                        <PlanCard
                          key={plan.id}
                          {...plan}
                          isSelected={field.value === plan.id}
                          onSelect={field.onChange}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex-1"
                >
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Terms and Submit */}
          {currentStep === 'terms' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Termos e Políticas</h3>
                <p className="text-muted-foreground">Leia e aceite nossos termos para finalizar o cadastro</p>
              </div>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          Eu li e aceito os{' '}
                          <Link
                            to="/terms"
                            className="text-primary hover:underline"
                            target="_blank"
                          >
                            Termos de Uso
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="acceptPrivacy"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm">
                          Eu li e aceito a{' '}
                          <Link
                            to="/privacy"
                            className="text-primary hover:underline"
                            target="_blank"
                          >
                            Política de Privacidade
                          </Link>
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Voltar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!canSubmit()}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Finalizar Cadastro
                </Button>
              </div>
            </div>
          )}
        </form>
      </Form>

      {/* Login Link */}
      {currentStep === 'account' && (
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Já tem uma conta? </span>
          <Link
            to="/auth/login"
            className="text-primary hover:underline font-medium"
          >
            Faça login
          </Link>
        </div>
      )}
    </div>
  );
};