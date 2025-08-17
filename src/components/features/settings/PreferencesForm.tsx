/**
 * PreferencesForm Component
 * 
 * Form for managing user preferences including theme selection and notification settings.
 * Integrates with global ThemeProvider for theme management.
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Palette, Bell, Monitor, Sun, Moon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useTheme } from '@/components/providers/theme-provider';
import { mockDb } from '@/mocks/db';

/**
 * Preferences validation schema
 */
const preferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    productUpdates: z.boolean(),
    accountActivity: z.boolean(),
  }),
});

type PreferencesFormData = z.infer<typeof preferencesSchema>;

/**
 * Theme option configuration
 */
const themeOptions = [
  { value: 'light', label: 'Claro', icon: Sun, description: 'Tema claro' },
  { value: 'dark', label: 'Escuro', icon: Moon, description: 'Tema escuro' },
  { value: 'system', label: 'Sistema', icon: Monitor, description: 'Seguir preferência do sistema' },
] as const;

interface PreferencesFormProps {
  /** Optional callback when preferences are updated */
  onUpdate?: (data: PreferencesFormData) => void;
}

/**
 * PreferencesForm component for managing user preferences
 * 
 * @example
 * ```tsx
 * <PreferencesForm onUpdate={(data) => console.log('Preferences updated:', data)} />
 * ```
 */
export const PreferencesForm = ({ onUpdate }: PreferencesFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialData, setInitialData] = useState<PreferencesFormData | null>(null);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const form = useForm<PreferencesFormData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      theme: 'system',
      notifications: {
        productUpdates: true,
        accountActivity: true,
      },
    },
  });

  const { watch, reset } = form;
  const watchedValues = watch();

  /**
   * Load user preferences on component mount
   */
  useEffect(() => {
    const loadPreferences = () => {
      // Get current user preferences (in real app, from API)
      const currentUser = mockDb.findUserById('1');
      
      if (currentUser?.preferences) {
        const preferencesData: PreferencesFormData = {
          theme: currentUser.preferences.theme as 'light' | 'dark' | 'system',
          notifications: {
            productUpdates: currentUser.preferences.notifications.productUpdates,
            accountActivity: currentUser.preferences.notifications.accountActivity,
          },
        };
        
        setInitialData(preferencesData);
        reset(preferencesData);
      }
    };

    loadPreferences();
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
   * Handle theme change immediately (no need to save)
   */
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    form.setValue('theme', newTheme);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: PreferencesFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update theme
      setTheme(data.theme);
      
      // In real app, this would be an API call to save preferences
      console.log('Saving preferences:', data);
      
      // Update mock data
      const currentUser = mockDb.findUserById('1');
      if (currentUser) {
        currentUser.preferences = {
          theme: data.theme,
          notifications: data.notifications,
        };
      }

      setInitialData(data);
      setHasChanges(false);
      
      toast({
        title: "Preferências salvas!",
        description: "Suas preferências foram atualizadas com sucesso.",
      });

      onUpdate?.(data);
      
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao salvar suas preferências. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Preferências</h2>
        <p className="text-muted-foreground">
          Personalize sua experiência no sistema.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema do Sistema</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value) => handleThemeChange(value as 'light' | 'dark' | 'system')}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tema" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themeOptions.map((option) => {
                          const IconComponent = option.icon;
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-sm text-muted-foreground">
                                    {option.description}
                                  </div>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Escolha como você quer que a interface seja exibida.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="notifications.productUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Atualizações de Produto
                      </FormLabel>
                      <FormDescription>
                        Receber e-mails sobre novos recursos e atualizações do sistema.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notifications.accountActivity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Atividades da Conta
                      </FormLabel>
                      <FormDescription>
                        Ser notificado sobre mudanças importantes na sua conta.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (initialData) {
                  reset(initialData);
                  setTheme(initialData.theme);
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
              className="min-w-[120px]"
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};