# Documento de Requisitos

## Introdução

Esta funcionalidade permitirá que administradores criem novos estudantes diretamente através do painel administrativo, sem que o estudante precise se registrar por conta própria. O sistema deve criar automaticamente as credenciais de acesso e enviar as informações para o estudante via email.

## Requisitos

### Requisito 1

**User Story:** Como administrador, eu quero criar novos estudantes diretamente no painel administrativo, para que eu possa gerenciar matrículas sem depender do auto-registro dos estudantes.

#### Critérios de Aceitação

1. QUANDO o administrador clicar no botão "Novo Estudante" ENTÃO o sistema DEVE abrir um modal com formulário de cadastro
2. QUANDO o administrador preencher os dados obrigatórios ENTÃO o sistema DEVE validar os campos antes de permitir o envio
3. QUANDO o formulário for submetido com dados válidos ENTÃO o sistema DEVE criar o usuário no Supabase Auth
4. QUANDO o usuário for criado com sucesso ENTÃO o sistema DEVE criar o perfil na tabela profiles
5. QUANDO o perfil for criado ENTÃO o sistema DEVE atribuir automaticamente a role de 'student'

### Requisito 2

**User Story:** Como administrador, eu quero que o sistema gere automaticamente credenciais temporárias para novos estudantes, para que eles possam acessar o sistema imediatamente.

#### Critérios de Aceitação

1. QUANDO um novo estudante for criado ENTÃO o sistema DEVE gerar uma senha temporária segura
2. QUANDO as credenciais forem geradas ENTÃO o sistema DEVE exibir as informações de login para o administrador
3. QUANDO o estudante for criado ENTÃO o sistema DEVE marcar a conta como "requer alteração de senha no primeiro login"
4. SE o email estiver configurado ENTÃO o sistema DEVE enviar as credenciais por email automaticamente

### Requisito 3

**User Story:** Como administrador, eu quero validar os dados do estudante antes de criar a conta, para que não haja duplicatas ou informações inválidas no sistema.

#### Critérios de Aceitação

1. QUANDO o administrador inserir um email ENTÃO o sistema DEVE verificar se já existe um usuário com esse email
2. QUANDO o administrador inserir uma matrícula ENTÃO o sistema DEVE verificar se já existe um estudante com essa matrícula
3. SE houver duplicata de email ou matrícula ENTÃO o sistema DEVE exibir mensagem de erro específica
4. QUANDO todos os campos obrigatórios estiverem preenchidos ENTÃO o sistema DEVE habilitar o botão de salvar
5. SE algum campo obrigatório estiver vazio ENTÃO o sistema DEVE desabilitar o botão de salvar

### Requisito 4

**User Story:** Como administrador, eu quero receber feedback claro sobre o sucesso ou falha da criação do estudante, para que eu saiba se a operação foi concluída corretamente.

#### Critérios de Aceitação

1. QUANDO o estudante for criado com sucesso ENTÃO o sistema DEVE exibir toast de sucesso com as credenciais geradas
2. QUANDO houver erro na criação ENTÃO o sistema DEVE exibir toast de erro com mensagem específica
3. QUANDO o estudante for criado com sucesso ENTÃO o sistema DEVE fechar o modal automaticamente
4. QUANDO o modal for fechado após sucesso ENTÃO o sistema DEVE atualizar a lista de estudantes
5. QUANDO houver erro ENTÃO o sistema DEVE manter o modal aberto para correção

### Requisito 5

**User Story:** Como estudante recém-criado pelo administrador, eu quero receber minhas credenciais de acesso, para que eu possa fazer login no sistema.

#### Critérios de Aceitação

1. QUANDO minha conta for criada pelo administrador ENTÃO eu DEVO receber um email com minhas credenciais
2. QUANDO eu fizer o primeiro login ENTÃO o sistema DEVE me forçar a alterar a senha temporária
3. QUANDO eu alterar a senha ENTÃO o sistema DEVE remover a marcação de "senha temporária"
4. SE o email não estiver configurado ENTÃO o administrador DEVE poder visualizar e copiar as credenciais