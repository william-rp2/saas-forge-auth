/**
 * Terms of Service Page
 * 
 * Legal terms page with:
 * - Comprehensive terms content
 * - Professional layout
 * - SEO optimization
 * - Last updated information
 */

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Terms of Service page component
 */
const Terms = () => {
  const lastUpdated = '16 de Agosto de 2024';

  return (
    <>
      <Helmet>
        <title>Termos de Uso - SaaS Core</title>
        <meta 
          name="description" 
          content="Leia os termos de uso do SaaS Core. Condições de serviço, direitos e responsabilidades dos usuários." 
        />
        <link rel="canonical" href="/terms" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Link to="/auth/signup">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar ao cadastro
              </Button>
            </Link>
            
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Termos de Uso
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Aceitação dos Termos
              </h2>
              <p className="text-foreground leading-relaxed">
                Ao acessar e usar o SaaS Core, você concorda em ficar vinculado por estes 
                Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não 
                concordar com algum desses termos, está proibido de usar ou acessar este site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Descrição do Serviço
              </h2>
              <p className="text-foreground leading-relaxed">
                O SaaS Core é uma plataforma de desenvolvimento que fornece ferramentas 
                e componentes para a criação de aplicações SaaS. Oferecemos diferentes 
                planos de assinatura com recursos variados para atender às necessidades 
                de desenvolvedores e empresas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Conta de Usuário
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Para usar nossos serviços, você deve:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li>Fornecer informações verdadeiras e atualizadas</li>
                  <li>Manter a confidencialidade de sua senha</li>
                  <li>Ser responsável por todas as atividades em sua conta</li>
                  <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Planos e Pagamentos
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Oferecemos diferentes planos de assinatura:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li><strong>Básico:</strong> Gratuito com recursos limitados</li>
                  <li><strong>Pro:</strong> Assinatura mensal com recursos avançados</li>
                  <li><strong>Enterprise:</strong> Plano anual para grandes equipes</li>
                </ul>
                <p className="text-foreground leading-relaxed">
                  Os pagamentos são processados de forma segura e os valores podem 
                  ser alterados mediante aviso prévio de 30 dias.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Uso Aceitável
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Você concorda em NÃO usar o serviço para:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li>Atividades ilegais ou fraudulentas</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Transmitir malware ou códigos maliciosos</li>
                  <li>Fazer engenharia reversa do software</li>
                  <li>Sobrecarregar nossos sistemas</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Propriedade Intelectual
              </h2>
              <p className="text-foreground leading-relaxed">
                O SaaS Core e todos os seus componentes, incluindo mas não limitado a 
                código, design, texto, imagens e logos, são propriedade nossa ou de 
                nossos licenciadores e são protegidos por leis de direitos autorais 
                e outras leis de propriedade intelectual.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Limitação de Responsabilidade
              </h2>
              <p className="text-foreground leading-relaxed">
                O SaaS Core é fornecido "como está" sem garantias de qualquer tipo. 
                Não nos responsabilizamos por danos indiretos, incidentais ou 
                consequenciais resultantes do uso ou incapacidade de usar nosso serviço.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Cancelamento
              </h2>
              <p className="text-foreground leading-relaxed">
                Você pode cancelar sua conta a qualquer momento. Reservamo-nos o 
                direito de suspender ou encerrar contas que violem estes termos. 
                Em caso de cancelamento, você mantém acesso aos serviços até o 
                final do período pago.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Alterações nos Termos
              </h2>
              <p className="text-foreground leading-relaxed">
                Podemos atualizar estes termos periodicamente. Mudanças significativas 
                serão comunicadas por e-mail com antecedência mínima de 30 dias. 
                O uso continuado do serviço após as alterações constitui aceitação 
                dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                10. Contato
              </h2>
              <p className="text-foreground leading-relaxed">
                Para questões sobre estes termos, entre em contato conosco através 
                do e-mail: legal@saascore.com
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground text-sm">
              © 2024 SaaS Core. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;