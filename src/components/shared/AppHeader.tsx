/**
 * Header unificado da aplicação
 * Inclui navegação, botão voltar, controle de acesso e menu do usuário
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Crown, 
  User, 
  Settings, 
  LogOut,
  Home,
  Shield,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useEntitlements } from '@/lib/hooks/useEntitlements';
import { usePermissions } from '@/lib/hooks/usePermissions';
import TeamSwitcher from '@/components/features/teams/TeamSwitcher';

interface AppHeaderProps {
  /** Título da página atual */
  title?: string;
  /** Subtítulo ou descrição da página */
  subtitle?: string;
  /** URL personalizada para o botão voltar */
  backTo?: string;
  /** Se deve mostrar o botão voltar */
  showBackButton?: boolean;
  /** Se deve mostrar o menu do usuário */
  showUserMenu?: boolean;
  /** Breadcrumbs personalizados */
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * Header principal da aplicação com navegação unificada
 */
export default function AppHeader({ 
  title, 
  subtitle, 
  backTo,
  showBackButton = true,
  showUserMenu = true,
  breadcrumbs 
}: AppHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPlan } = useEntitlements();
  const { can } = usePermissions();

  // Determina a URL de volta baseada na rota atual
  const getBackUrl = () => {
    if (backTo) return backTo;
    
    const path = location.pathname;
    
    // Configurações -> Dashboard
    if (path.startsWith('/settings')) return '/dashboard';
    
    // Admin pages -> Dashboard Admin ou Dashboard principal
    if (path.startsWith('/admin/')) {
      if (path === '/admin/dashboard') return '/dashboard';
      return '/admin/dashboard';
    }
    
    // Outras páginas -> Dashboard
    return '/dashboard';
  };

  const handleBack = () => {
    const backUrl = getBackUrl();
    navigate(backUrl);
  };

  // Dados mockados do usuário
  const currentUser = {
    name: 'Usuário Teste',
    email: 'teste@email.com',
    initials: 'UT'
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left side - Back button + Title */}
        <div className="flex items-center space-x-4">
          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </Button>
          )}

          {/* Logo + TeamSwitcher + Title */}
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-semibold text-foreground hidden sm:inline">
                SaaS Core
              </span>
            </Link>

            <TeamSwitcher />

            {currentPlan && (
              <Badge variant="secondary" className="hidden md:inline-flex">
                {currentPlan.name}
              </Badge>
            )}
          </div>

          {/* Page Title */}
          {title && (
            <div className="hidden lg:block">
              <div className="h-6 w-px bg-border mx-4" />
              <div>
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right side - Navigation + User menu */}
        <div className="flex items-center space-x-2">
          {/* Quick navigation - Admin only */}
          {can('manage', 'all') && (
            <div className="hidden md:flex items-center space-x-1 mr-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">
                  <Home className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/access-management">
                  <Shield className="w-4 h-4 mr-2" />
                  Acessos
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/plans">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Planos
                </Link>
              </Button>
            </div>
          )}

          {/* User Menu */}
          {showUserMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentUser.email}
                  </p>
                  {currentPlan && (
                    <Badge variant="outline" className="w-fit mt-1">
                      Plano {currentPlan.name}
                    </Badge>
                  )}
                </div>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/settings/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>

                {/* Admin menu items */}
                {can('manage', 'all') && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin/dashboard" className="flex items-center">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Administração</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Breadcrumbs (mobile title) */}
      {(title || breadcrumbs) && (
        <div className="lg:hidden border-t border-border bg-muted/30">
          <div className="container mx-auto px-4 py-3">
            {breadcrumbs ? (
              <nav className="flex items-center space-x-2 text-sm">
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.label} className="flex items-center space-x-2">
                    {crumb.href ? (
                      <Link 
                        to={crumb.href}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="text-foreground font-medium">{crumb.label}</span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <span className="text-muted-foreground">/</span>
                    )}
                  </div>
                ))}
              </nav>
            ) : (
              <div>
                <h1 className="text-lg font-semibold text-foreground">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}