import { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Shield, 
  CreditCard,
  Package,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import AppHeader from '@/components/shared/AppHeader';

/**
 * Layout administrativo unificado para todas as páginas de gestão
 * Inclui header unificado, sidebar com navegação e área de conteúdo principal
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Gestão de Acessos',
      href: '/admin/access-management',
      icon: Shield,
    },
    {
      title: 'Planos e Permissões',
      href: '/admin/plans',
      icon: CreditCard,
    },
    {
      title: 'Produtos',
      href: '/admin/products',
      icon: Package,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  // Get current page title
  const currentPage = navigationItems.find(item => item.href === location.pathname);
  const pageTitle = currentPage ? currentPage.title : 'Administração';

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        title="Administração"
        subtitle="Gestão completa do sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Administração', href: '/admin/dashboard' },
          { label: pageTitle }
        ]}
      />

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-20 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          pt-16
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-foreground">
              Menu Administrativo
            </h2>
            <p className="text-sm text-muted-foreground">
              Selecione uma área para gerenciar
            </p>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors duration-200
                  ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }
                `}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 min-h-screen pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}