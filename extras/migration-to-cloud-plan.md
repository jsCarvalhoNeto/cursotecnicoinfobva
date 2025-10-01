# Plano de Migração para Nuvem - Portal do Curso Técnico em Informática

## Visão Geral
Este plano detalha os passos necessários para migrar aplicação Node.js/Express com MySQL para um servidor na nuvem, mantendo o domínio existente.

## Requisitos da Aplicação
- **Backend**: Node.js com Express
- **Banco de Dados**: MySQL
- **Frontend**: React (Vite) - já embutido no backend
- **Dependências**: npm
- **Porta**: 4002 (configurável via .env)
- **Uploads**: Pasta `public/uploads` para arquivos estáticos

## Passos para Migração

### 1. Preparação do Servidor na Nuvem

#### 1.1 Configuração do Servidor
- [ ] Atualizar o sistema operacional
- [ ] Instalar Node.js (versão LTS)
- [ ] Instalar npm
- [ ] Instalar MySQL Server
- [ ] Instalar Nginx (para proxy reverso)
- [ ] Configurar firewall (ufw)
- [ ] Instalar PM2 (gerenciador de processos)

#### 1.2 Configuração de Segurança
- [ ] Configurar chaves SSH
- [ ] Desativar login com senha
- [ ] Configurar fail2ban
- [ ] Atualizar regularmente

### 2. Preparação do Banco de Dados

#### 2.1 Exportação do Banco de Dados Atual
- [ ] Fazer backup do banco de dados local (`josedo64_sisctibalbina`)
- [ ] Exportar estrutura e dados usando `mysqldump`
- [ ] Exportar também os dados existentes para preservar informações

#### 2.2 Importação no Servidor de Produção
- [ ] Criar banco de dados no servidor nuvem
- [ ] Criar usuário MySQL com permissões adequadas
- [ ] Importar schema.sql (ou dump do banco)
- [ ] Importar dados existentes

### 3. Preparação do Código da Aplicação

#### 3.1 Configuração de Ambiente de Produção
- [ ] Criar arquivo `.env` com variáveis de produção:
  ```
  DB_HOST=seu-servidor-nuvem
  DB_USER=seu_usuario_producao
  DB_PASSWORD=sua_senha_segura
  DB_NAME=nome_banco_producao
  PORT=4002
  ```
- [ ] Verificar permissões de upload
- [ ] Configurar pasta de uploads com permissões corretas

#### 3.2 Otimizações para Produção
- [ ] Remover logs excessivos
- [ ] Configurar logging adequado
- [ ] Ajustar configurações de CORS para produção
- [ ] Configurar tratamento de erros para produção

### 4. Deploy da Aplicação

#### 4.1 Transferência de Arquivos
- [ ] Fazer upload dos arquivos da aplicação para o servidor
- [ ] Instalar dependências com `npm install --production`
- [ ] Configurar permissões de arquivos

#### 4.2 Configuração do PM2
- [ ] Criar arquivo de configuração do PM2
- [ ] Configurar restart automático
- [ ] Configurar logs
- [ ] Iniciar a aplicação com PM2

### 5. Configuração do Domínio

#### 5.1 Configuração do Nginx
- [ ] Criar arquivo de configuração do site no Nginx
- [ ] Configurar proxy reverso para a porta 4002
- [ ] Configurar SSL com Let's Encrypt
- [ ] Configurar headers de segurança

#### 5.2 Configuração de DNS
- [ ] Apontar domínio para o IP do servidor
- [ ] Configurar registros A e CNAME conforme necessário
- [ ] Configurar SSL/TLS

### 6. Testes e Validação

#### 6.1 Testes Funcionais
- [ ] Verificar login e autenticação
- [ ] Testar todas as funcionalidades principais
- [ ] Testar upload de arquivos
- [ ] Testar CRUD de estudantes, professores, disciplinas

#### 6.2 Testes de Performance
- [ ] Testar carregamento de páginas
- [ ] Verificar uso de memória e CPU
- [ ] Testar concorrência se necessário

### 7. Configurações Adicionais

#### 7.1 Backup e Monitoramento
- [ ] Configurar backup automático do banco de dados
- [ ] Configurar backup dos arquivos de upload
- [ ] Configurar monitoramento da aplicação
- [ ] Configurar alertas

#### 7.2 Otimizações Finais
- [ ] Configurar cache se necessário
- [ ] Otimizar consultas ao banco de dados
- [ ] Configurar CDNs para assets estáticos

## Arquivos Necessários para Deploy

### Arquivo PM2 ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'informatica-wave',
    script: './src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4002
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

### Arquivo Nginx /etc/nginx/sites-available/informatica-wave
```nginx
server {
    listen 80;
    server_name seu-dominio.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com.br;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com.br/privkey.pem;

    location / {
        proxy_pass http://localhost:4002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads {
        alias /path/to/your/app/public/uploads;
        expires 30d;
    }
}
```

## Comandos de Deploy

### No Servidor de Produção:
```bash
# Instalação de dependências
sudo apt update
sudo apt install nodejs npm mysql-server nginx certbot python3-certbot-nginx

# Configuração do banco de dados
sudo mysql_secure_installation
sudo mysql -u root -p
CREATE DATABASE informatica_wave_prod;
CREATE USER 'app_user'@'localhost' IDENTIFIED BY 'senha_segura';
GRANT ALL PRIVILEGES ON informatica_wave_prod.* TO 'app_user'@'localhost';
FLUSH PRIVILEGES;

# Instalação do PM2
npm install -g pm2

# Deploy da aplicação
git clone https://github.com/seu-repo/informatica-wave.git
cd informatica-wave
npm install --production
pm2 start ecosystem.config.js
```

## Checklist Final
- [ ] Aplicação rodando corretamente
- [ ] Banco de dados conectado
- [ ] SSL configurado
- [ ] Domínio funcionando
- [ ] Uploads funcionando
- [ ] Todos os endpoints acessíveis
- [ ] Autenticação funcionando
- [ ] Backups configurados
- [ ] Monitoramento ativo
