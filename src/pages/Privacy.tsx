/**
 * Privacy Policy Page
 * 
 * Privacy policy page with:
 * - Comprehensive privacy information
 * - LGPD compliance structure
 * - Professional layout
 * - SEO optimization
 */

import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Privacy Policy page component
 */
const Privacy = () => {
  const lastUpdated = '16 de Agosto de 2024';

  return (
    <>
      <Helmet>
        <title>Política de Privacidade - SaaS Core</title>
        <meta 
          name="description" 
          content="Leia nossa política de privacidade. Como coletamos, usamos e protegemos seus dados pessoais no SaaS Core." 
        />
        <link rel="canonical" href="/privacy" />
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
              Política de Privacidade
            </h1>
            <p className="text-muted-foreground">
              Última atualização: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                1. Introdução
              </h2>
              <p className="text-foreground leading-relaxed">
                Esta Política de Privacidade descreve como o SaaS Core coleta, usa, 
                armazena e protege suas informações pessoais. Estamos comprometidos 
                em proteger sua privacidade e cumprir com a Lei Geral de Proteção 
                de Dados (LGPD) e outras regulamentações aplicáveis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                2. Informações que Coletamos
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Coletamos as seguintes categorias de informações:
                </p>
                
                <div className="ml-4 space-y-4">
                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      2.1 Informações fornecidas por você:
                    </h3>
                    <ul className="list-disc list-inside text-foreground space-y-1 ml-4">
                      <li>Nome completo</li>
                      <li>Endereço de e-mail</li>
                      <li>Informações de pagamento (processadas por terceiros)</li>
                      <li>Preferências de plano</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-medium text-foreground mb-2">
                      2.2 Informações coletadas automaticamente:
                    </h3>
                    <ul className="list-disc list-inside text-foreground space-y-1 ml-4">
                      <li>Endereço IP</li>
                      <li>Tipo de navegador e dispositivo</li>
                      <li>Páginas visitadas e tempo de uso</li>
                      <li>Cookies e tecnologias similares</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                3. Como Usamos suas Informações
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar pagamentos e gerenciar assinaturas</li>
                  <li>Comunicar atualizações e suporte técnico</li>
                  <li>Personalizar sua experiência</li>
                  <li>Cumprir obrigações legais</li>
                  <li>Prevenir fraudes e garantir segurança</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                4. Base Legal para Processamento
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Processamos seus dados com base em:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li><strong>Execução de contrato:</strong> Para fornecer nossos serviços</li>
                  <li><strong>Interesse legítimo:</strong> Para melhorar e proteger nossos serviços</li>
                  <li><strong>Consentimento:</strong> Para comunicações de marketing (opcional)</li>
                  <li><strong>Obrigação legal:</strong> Para cumprimento de leis aplicáveis</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                5. Compartilhamento de Informações
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Não vendemos suas informações pessoais. Podemos compartilhar dados apenas com:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li>Provedores de serviços terceirizados (sob contrato de confidencialidade)</li>
                  <li>Autoridades legais quando exigido por lei</li>
                  <li>Potenciais compradores em caso de fusão ou aquisição</li>
                  <li>Com seu consentimento explícito</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                6. Segurança dos Dados
              </h2>
              <p className="text-foreground leading-relaxed">
                Implementamos medidas técnicas e organizacionais apropriadas para 
                proteger suas informações contra acesso não autorizado, alteração, 
                divulgação ou destruição. Isso inclui criptografia, controles de 
                acesso e monitoramento de segurança.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                7. Retenção de Dados
              </h2>
              <p className="text-foreground leading-relaxed">
                Mantemos suas informações apenas pelo tempo necessário para cumprir 
                os propósitos descritos nesta política, exceto quando um período de 
                retenção mais longo for exigido ou permitido por lei. Dados de contas 
                inativas podem ser excluídos após 2 anos de inatividade.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                8. Seus Direitos (LGPD)
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Você tem os seguintes direitos sobre seus dados pessoais:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li><strong>Acesso:</strong> Solicitar cópia dos dados que possuímos</li>
                  <li><strong>Retificação:</strong> Corrigir dados incorretos ou incompletos</li>
                  <li><strong>Exclusão:</strong> Solicitar a remoção de seus dados</li>
                  <li><strong>Portabilidade:</strong> Obter seus dados em formato legível</li>
                  <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
                  <li><strong>Limitação:</strong> Restringir o processamento</li>
                </ul>
                <p className="text-foreground leading-relaxed">
                  Para exercer esses direitos, entre em contato conosco através do 
                  e-mail: privacy@saascore.com
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                9. Cookies
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Utilizamos cookies para:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li>Manter você logado</li>
                  <li>Lembrar suas preferências</li>
                  <li>Analisar o uso do site</li>
                  <li>Melhorar a experiência do usuário</li>
                </ul>
                <p className="text-foreground leading-relaxed">
                  Você pode gerenciar cookies através das configurações do seu navegador.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                10. Transferências Internacionais
              </h2>
              <p className="text-foreground leading-relaxed">
                Seus dados podem ser transferidos e armazenados em servidores localizados 
                fora do Brasil. Garantimos que essas transferências sejam feitas com 
                proteções adequadas, incluindo cláusulas contratuais padrão aprovadas 
                pela ANPD.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                11. Alterações nesta Política
              </h2>
              <p className="text-foreground leading-relaxed">
                Podemos atualizar esta política periodicamente. Mudanças significativas 
                serão comunicadas por e-mail com antecedência mínima de 30 dias. 
                Recomendamos revisar esta página regularmente para se manter informado.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                12. Contato e DPO
              </h2>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Para questões sobre esta política ou exercer seus direitos:
                </p>
                <ul className="list-disc list-inside text-foreground space-y-2 ml-4">
                  <li><strong>E-mail:</strong> privacy@saascore.com</li>
                  <li><strong>DPO:</strong> dpo@saascore.com</li>
                  <li><strong>Autoridade:</strong> ANPD (anpd.gov.br)</li>
                </ul>
              </div>
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

export default Privacy;