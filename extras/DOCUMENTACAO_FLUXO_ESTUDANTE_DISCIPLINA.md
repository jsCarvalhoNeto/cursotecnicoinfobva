# Fluxo de Relacionamento entre Estudantes e Disciplinas

## Visão Geral

O sistema do Portal Curso Técnico Balbina implementa um relacionamento entre estudantes e disciplinas através de uma tabela de matrículas (enrollments) que estabelece uma relação muitos-para-muitos.

## Estrutura do Banco de Dados

### Tabela `enrollments` (Matrículas)
```sql
CREATE TABLE `enrollments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `student_id` INT NOT NULL,
  `subject_id` INT NOT NULL,
  `enrollment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `unique_enrollment` (`student_id`, `subject_id`),
  FOREIGN KEY (`student_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Tabela `subjects` (Disciplinas)
```sql
CREATE TABLE `subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `teacher_id` INT NULL,
  `schedule` VARCHAR(255) NULL,
  `max_students` INT DEFAULT 40,
  `grade` ENUM('1º Ano', '2º Ano', '3º Ano') NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY (`teacher_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

## Fluxo de Relacionamento

### 1. Matrícula de Estudantes em Disciplinas

#### A. Processo de Matrícula
1. **Identificação do Estudante**: O estudante é identificado pelo `user_id` (tabela `users`)
2. **Identificação da Disciplina**: A disciplina é identificada pelo `subject_id` (tabela `subjects`)
3. **Criação da Matrícula**: Um registro é criado na tabela `enrollments` vinculando o estudante à disciplina

#### B. Implementação Técnica
- **Rota para buscar disciplinas do estudante**: `GET /api/students/:id/subjects`
- **Consulta SQL utilizada**:
```sql
SELECT s.*, p.full_name as teacher_name, e.enrollment_date
FROM subjects s
INNER JOIN enrollments e ON s.id = e.subject_id
LEFT JOIN profiles p ON s.teacher_id = p.user_id
WHERE e.student_id = ?
ORDER BY s.created_at DESC
```

### 2. APIs Disponíveis

#### A. Para Estudantes
- **GET /api/students/:id/subjects** - Retorna todas as disciplinas em que o estudante está matriculado
- **Response**:
```json
[
  {
    "id": 1,
    "name": "Lógica de Programação",
    "description": "Introdução à programação",
    "teacher_name": "Professor Silva",
    "enrollment_date": "2024-01-15T10:30:00.000Z"
  }
]
```

#### B. Para Disciplinas
- **GET /api/subjects/:id/students** - Retorna todos os estudantes matriculados em uma disciplina específica
- **Response**:
```json
[
  {
    "id": 1,
    "email": "aluno1@escola.com",
    "full_name": "João Silva",
    "student_registration": "2024001",
    "grade": "1º Ano"
  }
]
```

### 3. Processo de Matrícula Manual

#### A. Via Banco de Dados
```javascript
// Exemplo de matrícula manual
const [result] = await conn.execute(
  'INSERT INTO enrollments (student_id, subject_id) VALUES (?, ?)',
  [studentId, subjectId]
);
```

#### B. Validações Implementadas
- Verifica se o estudante existe e é um usuário com papel de estudante
- Verifica se a disciplina existe
- Evita matrículas duplicadas através da chave única (`student_id`, `subject_id`)

### 4. Consultas Relacionadas

#### A. Buscar Disciplinas de um Estudante
```sql
SELECT s.*, p.full_name as teacher_name, e.enrollment_date
FROM subjects s
INNER JOIN enrollments e ON s.id = e.subject_id
LEFT JOIN profiles p ON s.teacher_id = p.user_id
WHERE e.student_id = ?
ORDER BY s.created_at DESC
```

#### B. Buscar Estudantes de uma Disciplina
```sql
SELECT u.id, u.email, p.full_name, p.student_registration, p.grade
FROM users u
JOIN profiles p ON u.id = p.user_id
JOIN user_roles ur ON u.id = ur.user_id
JOIN enrollments e ON u.id = e.student_id
WHERE e.subject_id = ? AND ur.role = 'student'
ORDER BY p.full_name
```

## Componentes e Serviços

### 1. Controller de Estudantes
- **Arquivo**: `src/controllers/studentController.js`
- **Método**: `getSubjects` - Retorna as disciplinas do estudante

### 2. Controller de Disciplinas
- **Arquivo**: `src/controllers/subjectController.js`
- **Método**: `getStudentsBySubject` - Retorna os estudantes de uma disciplina

### 3. Serviços Frontend
- **Arquivo**: `src/services/studentService.ts` - Serviços relacionados a estudantes
- **Arquivo**: `src/services/subjectService.ts` - Serviços relacionados a disciplinas

## Testes e Validação

### 1. Testes Disponíveis
- **check_enrollments.js** - Verifica matrículas existentes
- **add_test_enrollment.js** - Adiciona matrículas de teste
- **test_student_subjects.cjs** - Testa a relação entre estudantes e disciplinas
- **test_subject_students.js** - Testa a relação de disciplinas para estudantes

### 2. Scripts de Validação
- Verificação de matrículas existentes
- Teste de consultas SQL
- Validação de integridade dos dados

## Benefícios do Sistema

1. **Gestão Eficiente**: Permite gerenciar matrículas de forma estruturada
2. **Acesso Rápido**: Consultas otimizadas para buscar disciplinas por estudante e vice-versa
3. **Integridade de Dados**: Chaves estrangeiras garantem consistência
4. **Evita Duplicatas**: Chave única previne matrículas duplicadas
5. **Rastreabilidade**: Data de matrícula registrada para auditoria

## Considerações Importantes

- O relacionamento é implementado como muitos-para-muitos, permitindo que um estudante esteja em múltiplas disciplinas e uma disciplina tenha múltiplos estudantes
- A tabela `enrollments` serve como tabela de junção entre `users` (estudantes) e `subjects` (disciplinas)
- A restrição de chave única evita que um estudante se matricule duas vezes na mesma disciplina
- A integridade referencial é mantida com chaves estrangeiras

## Regra de Negócio: Matrícula Automática por Série

### Status Atual
**IMPLEMENTADO:** A regra de negócio que automaticamente matricula um aluno em todas as disciplinas da série escolhida **ESTÁ IMPLEMENTADA** no sistema.

### Funcionalidade Atual
- Quando um estudante é criado com uma série definida, ele é automaticamente matriculado em **todas as disciplinas daquela série**
- Quando a série de um estudante existente é atualizada, suas matrículas são automaticamente atualizadas para as disciplinas da nova série
- Isso permite que todas as atividades direcionadas a essas disciplinas apareçam automaticamente para o aluno

### Implementação Realizada

#### A. Criação de Novo Estudante com Série:
1. **Controller de estudantes** (`src/controllers/studentController.js`) modificado
2. **Lógica adicionada** após criar o estudante para buscar disciplinas da série
3. **Inserção automática** de registros na tabela `enrollments` para cada disciplina da série

#### B. Atualização da Série de Estudante Existente:
1. **Método `update` no controller de estudantes** modificado
2. **Remoção das matrículas anteriores** automaticamente
3. **Adição de novas matrículas** baseadas na nova série

#### Código Implementado no Controller:
```javascript
// Para criação de estudante
if (grade) {
  const [subjects] = await req.db.execute(
    'SELECT id FROM subjects WHERE grade = ?',
    [grade]
  );
  
  for (const subject of subjects) {
    await req.db.execute(
      'INSERT IGNORE INTO enrollments (student_id, subject_id) VALUES (?, ?)',
      [userResult.insertId, subject.id]
    );
  }
}

// Para atualização de estudante
if (grade !== undefined) {
  // Remover matrículas anteriores
  await req.db.execute('DELETE FROM enrollments WHERE student_id = ?', [id]);
  
  // Adicionar novas matrículas se a série não for nula
  if (grade) {
    const [subjects] = await req.db.execute(
      'SELECT id FROM subjects WHERE grade = ?',
      [grade]
    );
    
    for (const subject of subjects) {
      await req.db.execute(
        'INSERT IGNORE INTO enrollments (student_id, subject_id) VALUES (?, ?)',
        [id, subject.id]
      );
    }
  }
}
```

### Benefícios da Implementação
- **Automação completa** de matrículas baseadas na série do aluno
- **Integração imediata** com atividades e conteúdos das disciplinas
- **Manutenção simplificada** - alterações na série refletem automaticamente nas matrículas
- **Experiência do usuário** aprimorada - aluno vê todas as disciplinas relevantes automaticamente
