/**
 * Forgot Password Page
 * 
 * Password recovery page with:
 * - Email submission form
 * - Security-focused messaging
 * - SEO optimization
 * - User guidance
 */

import { Helmet } from 'react-helmet-async';
import { AuthLayout } from '@/components/shared/AuthLayout';
import { ForgotPasswordForm } from '@/components/features/auth/ForgotPasswordForm';

/**
 * Forgot password page component
 */
const ForgotPassword = () => {
  return (
    <>
      <Helmet>
        <title>Esqueci a Senha - SaaS Core</title>
        <meta 
          name="description" 
          content="Recupere sua senha do SaaS Core. Enviaremos um link seguro para redefinir sua senha por e-mail." 
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <AuthLayout>
        <ForgotPasswordForm />
      </AuthLayout>
    </>
  );
};

export default ForgotPassword;