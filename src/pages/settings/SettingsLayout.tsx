/**
 * Settings Layout with Navigation
 */

import { Outlet, NavLink, useLocation, Navigate } from 'react-router-dom';
import { User, Shield, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const settingsNavigation = [
  { name: 'Perfil', href: '/settings/profile', icon: User },
  { name: 'Segurança', href: '/settings/security', icon: Shield },
  { name: 'Preferências', href: '/settings/preferences', icon: Palette },
];

export default function SettingsLayout() {
  const location = useLocation();

  // Redirect /settings to /settings/profile
  if (location.pathname === '/settings') {
    return <Navigate to="/settings/profile" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Configurações</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e preferências
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Navigation Sidebar */}
            <div className="lg:w-64">
              <nav className="space-y-2">
                {settingsNavigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}