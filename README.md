# Portal do Curso Técnico em Informática - Refatorado

Este é o portal do curso técnico em informática, após refatoração completa para melhor manutenibilidade e escalabilidade.

## Estrutura do Projeto

```
src/
├── server.js                 # Arquivo principal do servidor
├── controllers/              # Controladores para lógica de negócios
│   ├── authController.js     # Controle de autenticação
│   ├── studentController.js  # Controle de estudantes
│   ├── teacherController.js  # Controle de professores
│   ├── subjectController.js  # Controle de disciplinas
│   └── userController.js     # Controle de usuários
├── routes/                   # Definições de rotas
│   ├── auth.js              # Rotas de autenticação
│   ├── students.js          # Rotas de estudantes
│   ├── teachers.js          # Rotas de professores
│   ├── subjects.js          # Rotas de disciplinas
│   └── users.js             # Rotas de usuários
├── middleware/              # Middleware personalizados
│   ├── database.js          # Middleware de banco de dados
│   └── errorHandler.js      # Middleware de tratamento de erros
└── database/                # Arquivos de banco de dados
```

## Funcionalidades

### Autenticação
- Cadastro de novos usuários
- Login e logout
- Recuperação de informações do usuário autenticado

### Estudantes
- Criação, leitura, atualização e exclusão de estudantes
- Busca de disciplinas do estudante
- Filtragem por série

### Professores
- Criação, leitura, atualização e exclusão de professores
- Associação de disciplinas aos professores
- Busca de alunos e disciplinas do professor
- Atividades pendentes e calendário

### Disciplinas
- Criação, leitura e exclusão de disciplinas
- Associação com professores
- Gerenciamento de vagas e horários

### Usuários
- Atualização de papéis (admin, student, teacher)
- Busca de todos os usuários com seus papéis

## Configuração do Ambiente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=informatica_wave
PORT=4001
```

3. Inicie o servidor:
```bash
npm start
# ou para desenvolvimento
npm run dev
```

## Deploy para Produção

### Pré-requisitos no Servidor de Produção
- Node.js (versão LTS)
- npm
- MySQL Server
- Nginx
- PM2 (instalado globalmente: `npm install -g pm2`)

### Passos para Deploy

1. **Configurar o banco de dados:**
   - Crie o banco de dados no servidor MySQL
   - Execute o schema.sql para criar as tabelas
   - Configure as credenciais no `.env`

2. **Configurar variáveis de ambiente:**
   - Crie o arquivo `.env` com as configurações de produção
   - Use o exemplo `.env.production.example` como base

3. **Fazer o deploy dos arquivos:**
   ```bash
   # Instalar dependências de produção
   npm install --production
   
   # Iniciar a aplicação com PM2
   pm2 start ecosystem.config.js
   
   # Salvar configuração do PM2
   pm2 save
   ```

4. **Configurar Nginx como proxy reverso:**
   - Crie o arquivo de configuração no Nginx
   - Configure SSL com Let's Encrypt
   - Reinicie o Nginx

5. **Configurar auto-start do PM2:**
   ```bash
   pm2 startup
   ```

### Arquivos Importantes para Deploy
- `ecosystem.config.js` - Configuração do PM2
- `deploy.sh` - Script de deploy automatizado
- `.env.production.example` - Exemplo de variáveis de produção

## Melhorias da Refatoração

- **Separação de responsabilidades**: Cada módulo tem sua própria pasta e arquivos
- **Facilidade de manutenção**: Código mais organizado e fácil de entender
- **Escalabilidade**: Nova funcionalidade pode ser adicionada sem poluir o código existente
- **Testabilidade**: Componentes menores são mais fáceis de testar
- **Tratamento de erros centralizado**: Melhor gerenciamento de erros
- **Transações de banco de dados**: Melhor integridade dos dados
- **Middleware de autenticação**: Segurança aprimorada

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Obter informações do usuário
- `POST /api/auth/logout` - Logout de usuário

### Estudantes
- `POST /api/students` - Criar estudante
- `GET /api/students` - Listar estudantes
- `GET /api/students/:id` - Obter estudante específico
- `PUT /api/students/:id` - Atualizar estudante
- `DELETE /api/students/:id` - Deletar estudante
- `PUT /api/students/:id/password` - Atualizar senha
- `GET /api/students/:id/subjects` - Disciplinas do estudante
- `GET /api/students/grade/:grade` - Estudantes por série

### Professores
- `POST /api/teachers` - Criar professor
- `GET /api/teachers` - Listar professores
- `PUT /api/teachers/:id` - Atualizar professor
- `DELETE /api/teachers/:id` - Deletar professor
- `GET /api/teachers/:id/subjects` - Disciplinas do professor
- `GET /api/teachers/:id/students` - Alunos do professor
- `GET /api/teachers/:id/activities/pending` - Atividades pendentes
- `GET /api/teachers/:id/calendar` - Eventos do calendário
- `POST /api/teachers/:teacherId/subjects` - Associar disciplinas
- `DELETE /api/teachers/:teacherId/subjects/:subjectId` - Remover associação
- `PUT /api/teachers/:teacherId/subjects` - Atualizar todas as disciplinas

### Disciplinas
- `POST /api/subjects` - Criar disciplina
- `GET /api/subjects` - Listar disciplinas
- `DELETE /api/subjects/:id` - Deletar disciplina

### Usuários
- `PUT /api/users/:id/role` - Atualizar papel do usuário
- `GET /api/users` - Listar todos os usuários
