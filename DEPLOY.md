# 🚀 Guia de Deploy - SaaS Forge Auth

Este documento contém instruções completas para deploy da aplicação em diferentes ambientes.

## 📋 Pré-requisitos

- Node.js 18+ 
- Docker e Docker Compose
- Git
- Conta no Supabase (para produção)
- Domínio configurado (para produção)

## 🔧 Configuração de Ambiente

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

**Variáveis Obrigatórias:**
- `NEXTAUTH_SECRET`: Chave secreta para NextAuth
- `NEXTAUTH_URL`: URL da aplicação
- `NEXT_PUBLIC_SUPABASE_URL`: URL do projeto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Chave anônima do Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Chave de serviço do Supabase

## 🐳 Deploy com Docker

### Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone <repository-url>
cd saas-forge-auth

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 3. Execute com Docker Compose
docker-compose up -d

# 4. Acesse a aplicação
# http://localhost:3000
```

### Produção

```bash
# 1. Build da imagem de produção
docker build -t saas-forge-auth:latest .

# 2. Execute com perfil de produção
docker-compose --profile production up -d

# 3. Configure SSL/TLS (ver seção SSL)
```

## ☁️ Deploy em Cloud Providers

### Vercel (Recomendado para Next.js)

1. **Conecte o repositório:**
   - Acesse [vercel.com](https://vercel.com)
   - Importe o projeto do GitHub

2. **Configure as variáveis de ambiente:**
   ```bash
   # No dashboard da Vercel, adicione:
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   SENTRY_DSN=your-sentry-dsn
   NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-id
   ```

3. **Deploy automático:**
   - Push para a branch main ativa o deploy automático

### AWS ECS/Fargate

1. **Prepare a imagem:**
   ```bash
   # Build e tag da imagem
   docker build -t saas-forge-auth .
   docker tag saas-forge-auth:latest <account-id>.dkr.ecr.<region>.amazonaws.com/saas-forge-auth:latest
   
   # Push para ECR
   aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
   docker push <account-id>.dkr.ecr.<region>.amazonaws.com/saas-forge-auth:latest
   ```

2. **Configure ECS Task Definition:**
   ```json
   {
     "family": "saas-forge-auth",
     "networkMode": "awsvpc",
     "requiresCompatibilities": ["FARGATE"],
     "cpu": "256",
     "memory": "512",
     "containerDefinitions": [
       {
         "name": "saas-forge-auth",
         "image": "<account-id>.dkr.ecr.<region>.amazonaws.com/saas-forge-auth:latest",
         "portMappings": [
           {
             "containerPort": 3000,
             "protocol": "tcp"
           }
         ],
         "environment": [
           {"name": "NODE_ENV", "value": "production"},
           {"name": "NEXTAUTH_URL", "value": "https://your-domain.com"}
         ]
       }
     ]
   }
   ```

### Google Cloud Run

```bash
# 1. Build e push da imagem
gcloud builds submit --tag gcr.io/PROJECT-ID/saas-forge-auth

# 2. Deploy no Cloud Run
gcloud run deploy saas-forge-auth \
  --image gcr.io/PROJECT-ID/saas-forge-auth \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,NEXTAUTH_URL=https://your-domain.com"
```

### DigitalOcean App Platform

1. **Crie o arquivo `.do/app.yaml`:**
   ```yaml
   name: saas-forge-auth
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/saas-forge-auth
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: NEXTAUTH_SECRET
       value: your-secret
       type: SECRET
   ```

## 🔒 Configuração SSL/TLS

### Com Let's Encrypt (Nginx)

1. **Instale Certbot:**
   ```bash
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Obtenha certificado:**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Configure renovação automática:**
   ```bash
   sudo crontab -e
   # Adicione: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Configuração Nginx

Crie o arquivo `nginx.conf`:

```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

## 📊 Monitoramento

### Ativando Monitoramento

```bash
# Execute com perfil de monitoramento
docker-compose --profile monitoring up -d

# Acesse os dashboards:
# Prometheus: http://localhost:9090
# Grafana: http://localhost:3001 (admin/admin)
```

### Configuração do Sentry

1. **Crie projeto no Sentry**
2. **Configure DSN no .env:**
   ```bash
   SENTRY_DSN=https://your-dsn@sentry.io/project-id
   ```

### Health Checks

A aplicação inclui endpoint de health check:
- `GET /api/health` - Status da aplicação
- `GET /api/health/db` - Status do banco de dados

## 🔄 CI/CD

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build application
        run: npm run build:prod
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🗄️ Backup e Recuperação

### Backup do Banco de Dados

```bash
# Backup PostgreSQL
docker exec saas-postgres pg_dump -U postgres saas_forge > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
docker exec -i saas-postgres psql -U postgres saas_forge < backup_file.sql
```

### Backup de Arquivos

```bash
# Backup volumes Docker
docker run --rm -v saas-forge-auth_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com banco:**
   ```bash
   # Verifique se o PostgreSQL está rodando
   docker-compose ps
   
   # Verifique logs
   docker-compose logs postgres
   ```

2. **Erro de build:**
   ```bash
   # Limpe cache do Docker
   docker system prune -a
   
   # Rebuild sem cache
   docker-compose build --no-cache
   ```

3. **Problemas de SSL:**
   ```bash
   # Verifique certificados
   openssl x509 -in cert.pem -text -noout
   
   # Teste SSL
   curl -I https://your-domain.com
   ```

### Logs e Debug

```bash
# Logs da aplicação
docker-compose logs -f app

# Logs específicos
docker-compose logs --tail=100 postgres

# Acesso ao container
docker-compose exec app sh
```

## 📈 Otimização de Performance

### Configurações de Produção

1. **Otimize imagens Docker:**
   - Use multi-stage builds
   - Minimize layers
   - Use .dockerignore

2. **Configure CDN:**
   - Cloudflare para assets estáticos
   - Cache de API responses

3. **Database optimization:**
   - Índices apropriados
   - Connection pooling
   - Query optimization

### Métricas Importantes

- **Response time:** < 200ms
- **Uptime:** > 99.9%
- **Error rate:** < 0.1%
- **Memory usage:** < 80%
- **CPU usage:** < 70%

## 🔐 Segurança

### Checklist de Segurança

- [ ] HTTPS configurado
- [ ] Variáveis de ambiente seguras
- [ ] Rate limiting implementado
- [ ] CORS configurado
- [ ] Headers de segurança
- [ ] Backup regular
- [ ] Monitoramento ativo
- [ ] Logs de auditoria

### Headers de Segurança

Configure no `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verifique os logs da aplicação
2. Consulte a documentação do projeto
3. Abra uma issue no repositório
4. Entre em contato com a equipe de desenvolvimento

---

**Última atualização:** $(date +%Y-%m-%d)
**Versão:** 1.0.0