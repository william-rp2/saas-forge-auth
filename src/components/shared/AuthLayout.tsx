/**
 * AuthLayout Component
 * 
 * Provides a consistent layout for authentication pages with:
 * - Split-screen design (desktop)
 * - Responsive mobile layout
 * - Brand visual on the left side
 * - Form content on the right side
 */

import { ReactNode } from 'react';

interface AuthLayoutProps {
  /** Content to display in the form area */
  children: ReactNode;
  /** Optional title for the page */
  title?: string;
  /** Optional subtitle for the page */
  subtitle?: string;
}

/**
 * Authentication layout wrapper component
 */
export const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Brand visual (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-light items-center justify-center p-8">
        <div className="text-center text-primary-foreground">
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-12 h-12"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">SaaS Core</h1>
            <p className="text-xl opacity-90">
              A base perfeita para seus projetos SaaS
            </p>
          </div>
          <div className="space-y-4 text-lg opacity-80">
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Arquitetura reutilizável</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Componentes modulares</span>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>Pronto para produção</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo (visible only on mobile) */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-primary-foreground"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground">SaaS Core</h1>
          </div>

          {/* Page title and subtitle */}
          {(title || subtitle) && (
            <div className="text-center space-y-2">
              {title && (
                <h2 className="text-3xl font-bold text-foreground">{title}</h2>
              )}
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}

          {/* Form content */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};