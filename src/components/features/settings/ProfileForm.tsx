/**
 * ProfileForm Component
 * 
 * Form for editing user profile information including avatar, personal details,
 * and contact information. Includes input masking for CPF field.
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Upload, User } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';
import { mockDb } from '@/mocks/db';

/**
 * CPF input mask utility
 */
const applyCpfMask = (value: string): string => {
  // Remove all non-numeric characters
  const numeric = value.replace(/\D/g, '');
  
  // Apply mask: 999.999.999-99
  if (numeric.length <= 3) return numeric;
  if (numeric.length <= 6) return `${numeric.slice(0, 3)}.${numeric.slice(3)}`;
  if (numeric.length <= 9) return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6)}`;
  return `${numeric.slice(0, 3)}.${numeric.slice(3, 6)}.${numeric.slice(6, 9)}-${numeric.slice(9, 11)}`;
};

/**
 * Form validation schema
 */
const profileSchema = z.object({
  fullName: z.string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.string().email('E-mail inválido'),
  birthDate: z.date().optional(),
  cpf: z.string()
    .min(14, 'CPF deve estar completo')
    .max(14, 'CPF inválido')
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'Formato de CPF inválido')
    .optional(),
  avatar: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  /** Optional callback when profile is successfully updated */
  onUpdate?: (data: ProfileFormData) => void;
}

/**
 * ProfileForm component for editing user profile
 * 
 * @example
 * ```tsx
 * <ProfileForm onUpdate={(data) => console.log('Profile updated:', data)} />
 * ```
 */
export const ProfileForm = ({ onUpdate }: ProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<ProfileFormData | null>(null);
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      birthDate: undefined,
      cpf: '',
      avatar: '',
    },
  });

  const { watch, reset } = form;
  const watchedValues = watch();

  /**
   * Load user data on component mount
   */
  useEffect(() => {
    const loadUserData = () => {
      // Get current user (in real app, from auth context)
      const currentUser = mockDb.findUserById('1');
      const profile = mockDb.findProfileByUserId('1');
      
      if (currentUser) {
        const userData: ProfileFormData = {
          fullName: currentUser.name,
          email: currentUser.email,
          birthDate: currentUser.birthDate ? new Date(currentUser.birthDate) : undefined,
          cpf: currentUser.cpf || '',
          avatar: profile?.avatar || '',
        };
        
        setInitialData(userData);
        reset(userData);
      }
    };

    loadUserData();
  }, [reset]);

  /**
   * Watch for form changes to enable/disable save button
   */
  useEffect(() => {
    if (initialData) {
      const hasFormChanges = JSON.stringify(watchedValues) !== JSON.stringify(initialData);
      setHasChanges(hasFormChanges);
    }
  }, [watchedValues, initialData]);

  /**
   * Handle avatar upload simulation
   */
  const handleAvatarUpload = () => {
    // Simulate file upload
    toast({
      title: "Upload de Avatar",
      description: "Em uma aplicação real, aqui seria implementado o upload de arquivo.",
    });
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would be an API call to update user profile
      console.log('Updating profile with data:', data);
      
      // Update mock data
      const updatedUser = mockDb.updateUser('1', {
        name: data.fullName,
        birthDate: data.birthDate?.toISOString(),
        cpf: data.cpf,
      });

      if (updatedUser) {
        setInitialData(data);
        setHasChanges(false);
        
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso.",
        });

        onUpdate?.(data);
      }
    } catch (error) {
      toast({
        title: "Erro ao atualizar",
        description: "Ocorreu um erro ao salvar suas informações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Informações do Perfil</h2>
        <p className="text-muted-foreground">
          Gerencie suas informações pessoais e dados de contato.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={watchedValues.avatar} alt="Avatar" />
              <AvatarFallback>
                <User className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAvatarUpload}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Alterar Foto
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                JPG, PNG ou GIF até 2MB
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="seu@email.com" 
                      disabled 
                      className="bg-muted"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data de Nascimento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="000.000.000-00"
                      value={field.value}
                      onChange={(e) => {
                        const maskedValue = applyCpfMask(e.target.value);
                        field.onChange(maskedValue);
                      }}
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (initialData) {
                  reset(initialData);
                  setHasChanges(false);
                }
              }}
              disabled={!hasChanges || isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!hasChanges || isLoading}
              className="min-w-[140px]"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};