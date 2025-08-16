/**
 * Login Page
 * 
 * Authentication page for user login with:
 * - Responsive layout
 * - SEO optimization
 * - Form integration
 * - Proper meta tags
 */

import { Helmet } from 'react-helmet-async';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { LoginForm } from '@/components/features/auth/LoginForm';

/**
 * Login page component
 */
const Login = () => {
  return (
    <>
      <Helmet>
        <title>Login - SaaS Core</title>
        <meta 
          name="description" 
          content="Faça login na sua conta SaaS Core. Acesse seu dashboard e gerencie seus projetos com facilidade." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AuthLayout
        title="Bem-vindo de volta"
        subtitle="Faça login para acessar sua conta"
      >
        <LoginForm />
      </AuthLayout>
    </>
  );
};

export default Login;