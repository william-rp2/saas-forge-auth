import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>SaaS Core - Template de Autenticação Reutilizável</title>
        <meta name="description" content="Template SaaS Core com módulo de autenticação completo. Arquitetura reutilizável e componentes modulares." />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 mx-auto bg-primary rounded-full flex items-center justify-center mb-8">
            <svg className="w-10 h-10 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-foreground">SaaS Core</h1>
          <p className="text-xl text-muted-foreground">Template de autenticação reutilizável para projetos SaaS</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/auth/login">
              <Button size="lg" className="w-full sm:w-auto">Fazer Login</Button>
            </Link>
            <Link to="/auth/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">Criar Conta</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
