/**
 * Signup Page
 * 
 * User registration page with:
 * - Multi-step form
 * - Plan selection
 * - SEO optimization
 * - Responsive design
 */

import { Helmet } from 'react-helmet-async';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { SignupForm } from '@/components/features/auth/SignupForm';

/**
 * Signup page component
 */
const Signup = () => {
  return (
    <>
      <Helmet>
        <title>Criar Conta - SaaS Core</title>
        <meta 
          name="description" 
          content="Crie sua conta gratuita no SaaS Core. Comece a construir seus projetos SaaS com nossa plataforma completa." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/auth/signup" />
      </Helmet>

      <AuthLayout
        title="Criar sua conta"
        subtitle="Comece sua jornada conosco"
      >
        <SignupForm />
      </AuthLayout>
    </>
  );
};

export default Signup;