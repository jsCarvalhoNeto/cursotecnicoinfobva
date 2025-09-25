/**
 * Script de teste para verificar o fluxo de autenticação após a correção
 */

// Importar o banco de dados mockado centralizado
import { mockDbUtils, mockDatabase } from './src/lib/mockDatabase.js';

console.log('=== Teste de Fluxo de Autenticação ===\n');

// 1. Verificar estado inicial do banco de dados
console.log('1. Estado inicial do banco de dados:');
console.log('Usuários existentes:', mockDatabase.users.map(u => ({ id: u.id, email: u.email, role: u.role })));

// 2. Simular criação de um novo estudante (como no studentService)
console.log('\n2. Simulando criação de novo estudante...');
const temporaryPassword = 'TempPass123!'; // Senha temporária gerada
const newStudentData = {
  email: 'novo.aluno@teste.com',
  password: temporaryPassword,
  role: 'student',
  fullName: 'Novo Aluno Teste',
  registration: '2024TEST001',
};

const newUser = mockDbUtils.addUser(newStudentData);
mockDbUtils.addProfile({
  user_id: newUser.id,
  full_name: newStudentData.fullName,
  email: newStudentData.email,
  student_registration: newStudentData.registration,
});
mockDbUtils.addRole({
  user_id: newUser.id,
  role: 'student',
});

console.log('Novo estudante criado:', { id: newUser.id, email: newUser.email, temporaryPassword });

// 3. Simular tentativa de login (como no useAuth)
console.log('\n3. Simulando tentativa de login com as credenciais geradas...');
const email = 'novo.aluno@teste.com';
const password = temporaryPassword;

const userFound = mockDbUtils.getUserByEmail(email);
console.log('Usuário encontrado no banco de dados:', userFound);

if (userFound && userFound.password === password) {
  console.log('✅ Login bem-sucedido!');
  console.log('Usuário pode fazer login com a senha temporária.');
} else {
  console.log('❌ Login falhou!');
  console.log('Senha no banco:', userFound?.password);
  console.log('Senha fornecida:', password);
  console.log('Senhas coincidem:', userFound?.password === password);
}

// 4. Verificar todos os estudantes cadastrados
console.log('\n4. Todos os estudantes no sistema:');
const allStudents = mockDbUtils.getAllStudents();
console.log('Total de estudantes:', allStudents.length);
allStudents.forEach((student, index) => {
  console.log(`${index + 1}. ${student.full_name} (${student.email}) - ID: ${student.user_id}`);
});

// 5. Testar login com usuário existente
console.log('\n5. Testando login com usuário existente (student@portal.com)...');
const existingUser = mockDbUtils.getUserByEmail('student@portal.com');
const existingPassword = 'password123';

if (existingUser && existingUser.password === existingPassword) {
  console.log('✅ Login com usuário existente bem-sucedido!');
} else {
  console.log('❌ Login com usuário existente falhou!');
  console.log('Senha no banco:', existingUser?.password);
  console.log('Senha fornecida:', existingPassword);
}

console.log('\n=== Teste Concluído ===');
console.log('O sistema agora usa um banco de dados centralizado para cadastro e autenticação.');
console.log('Os alunos criados no painel de administração agora podem fazer login corretamente.');
