# Relação entre Disciplinas e Professores

## Visão Geral

Este documento descreve a implementação da relação entre disciplinas e professores no sistema do Portal Curso Técnico Balbina.

## Estrutura do Banco de Dados

A relação entre disciplinas e professores é implementada na tabela `subjects`:

```sql
CREATE TABLE `subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `teacher_id` INT NULL,  -- Chave estrangeira para a tabela users
  `schedule` VARCHAR(255) NULL,
  `max_students` INT DEFAULT 40,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Funcionalidades Implementadas

### 1. Cadastro de Disciplinas com Professores

- **Frontend**: O modal de cadastro de disciplinas (`SubjectModal.tsx`) agora inclui um campo de seleção (select) para escolher um professor existente
- **Backend**: A rota `POST /api/subjects` agora aceita o parâmetro `teacher_id` e valida se o professor existe e é um usuário com papel de professor

### 2. Visualização de Disciplinas

- **Frontend**: O dashboard administrativo exibe o nome do professor associado a cada disciplina
- **Backend**: A rota `GET /api/subjects` retorna o nome do professor junto com os dados da disciplina

### 3. Filtragem por Professor

- **Frontend**: Serviço `teacherService.ts` inclui função `getSubjectsByTeacher()` para buscar disciplinas de um professor específico
- **Backend**: A rota `GET /api/subjects` aceita o parâmetro `teacher_id` para filtrar disciplinas por professor

## APIs Implementadas

### POST /api/subjects
Cria uma nova disciplina com associação opcional a um professor.

**Request Body:**
```json
{
  "name": "Nome da Disciplina",
  "description": "Descrição da disciplina",
  "schedule": "Horário da disciplina",
  "max_students": 30,
  "teacher_id": 123  // ID do professor (opcional)
}
```

**Validações:**
- O nome da disciplina é obrigatório
- Se `teacher_id` for fornecido, o professor deve existir e ter papel de professor

### GET /api/subjects
Busca todas as disciplinas ou filtra por professor.

**Parâmetros:**
- `teacher_id` (opcional): Filtra disciplinas por ID do professor

**Response:**
```json
[
  {
    "id": 1,
    "name": "Lógica de Programação",
    "description": "Introdução à programação",
    "teacher_id": 123,
    "teacher_name": "Professor Silva",
    "schedule": "Segunda e Quarta 14:00-16:00",
    "max_students": 40
  }
]
```

## Componentes Atualizados

### SubjectModal.tsx
- Substituiu o campo de texto `teacher_name` por um select com professores disponíveis
- Adiciona funcionalidade de busca de professores ao abrir o modal
- Envia `teacher_id` na requisição de criação

### AdminDashboard.tsx
- Exibe o nome do professor associado a cada disciplina
- Mostra "Não atribuído" quando não há professor associado

### teacherService.ts
- Adiciona função `getSubjectsByTeacher()` para buscar disciplinas por professor

## Testes Realizados

O script `test_subject_teacher_relation.js` foi criado e executado com sucesso, verificando:

- ✅ Criação de disciplina com professor associado
- ✅ Visualização do nome do professor nas disciplinas
- ✅ Filtragem de disciplinas por professor
- ✅ Criação de disciplinas sem professor (NULL)
- ✅ Validação correta do ID do professor

## Benefícios da Implementação

1. **Gestão Melhorada**: Facilita a associação de professores às disciplinas que lecionam
2. **Visualização Clara**: Permite ver rapidamente quais disciplinas cada professor está responsável
3. **Filtragem Eficiente**: Possibilita buscar disciplinas por professor específico
4. **Integridade de Dados**: Validação no backend garante que apenas professores válidos sejam associados

## Considerações Futuras

- Implementar rota de edição de disciplinas (`PUT /api/subjects/:id`)
- Adicionar funcionalidade de atribuição de professores em massa
- Criar relatórios de carga horária por professor
