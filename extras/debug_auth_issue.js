/**
 * Script de debug para verificar o problema de autenticação
 */

import { mockDbUtils, mockDatabase } from './src/lib/mockDatabase.js';
import { createStudent } from './src/services/studentService.js';

async function runDebug() {
  console.log('=== Debug de Problema de Autenticação ===\n');

  // Verificar estado inicial
  console.log('1. Estado inicial do banco de dados:');
  console.log('Total de usuários:', mockDatabase.users.length);
  mockDatabase.users.forEach(user => {
    console.log(`  - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}, Password: ${user.password}`);
  });

  // Simular criação de estudante como no sistema real
  console.log('\n2. Criando estudante via createStudent...');
  const studentData = {
    fullName: 'Teste Aluno',
    email: 'teste.aluno@debug.com',
    studentRegistration: '2024DEBUG001'
  };

  const result = await createStudent(studentData);
  console.log('Resultado da criação:', result);

  if (result.success && result.user) {
    console.log('\n3. Dados do estudante criado:');
    console.log(' - ID:', result.user.id);
    console.log('  - Email:', result.user.email);
    console.log('  - Senha temporária:', result.user.temporaryPassword);
    
    // Verificar se o usuário foi realmente criado no banco
    const createdUser = mockDbUtils.getUserByEmail(result.user.email);
    console.log('\n4. Usuário encontrado no banco de dados:');
    console.log('  - Encontrado:', !!createdUser);
    if (createdUser) {
      console.log('  - ID:', createdUser.id);
      console.log('  - Email:', createdUser.email);
      console.log('  - Role:', createdUser.role);
      console.log(' - Password:', createdUser.password);
      console.log('  - Senhas coincidem:', createdUser.password === result.user.temporaryPassword);
    }
    
    // Testar login com as credenciais geradas
    console.log('\n5. Testando login com credenciais geradas...');
    const loginAttempt = mockDbUtils.getUserByEmail(result.user.email);
    if (loginAttempt && loginAttempt.password === result.user.temporaryPassword) {
      console.log('  ✅ Login funcionaria corretamente!');
    } else {
      console.log('  ❌ Login falharia!');
      if (!loginAttempt) {
        console.log('  - Usuário não encontrado no banco');
      } else {
        console.log(' - Senhas não coincidem');
        console.log(' - Senha no banco:', loginAttempt.password);
        console.log('  - Senha gerada:', result.user.temporaryPassword);
      }
    }
  } else {
    console.log('Falha na criação do estudante:', result.error);
  }

  // Verificar todos os usuários após a criação
  console.log('\n6. Estado final do banco de dados:');
  console.log('Total de usuários:', mockDatabase.users.length);
  mockDatabase.users.forEach(user => {
    console.log(`  - ID: ${user.id}, Email: ${user.email}, Role: ${user.role}`);
 });

  // Verificar se há algum estudante com role de admin
  console.log('\n7. Verificando estudantes com role de admin (problema mencionado):');
  const studentsWithAdminRole = mockDatabase.users.filter(user => user.role === 'student' && user.id === '1'); // O usuário admin padrão
  console.log('Estudantes com role de admin:', studentsWithAdminRole);

  const allStudents = mockDatabase.users.filter(user => user.role === 'student');
  console.log('Todos os estudantes:');
  allStudents.forEach(student => {
    console.log(`  - ID: ${student.id}, Email: ${student.email}, Registration: ${student.registration}`);
  });

  // Verificar se algum estudante criado tem role de admin
  const createdStudentsWithWrongRole = mockDatabase.users.filter(user => 
    user.email.includes('debug') && user.role === 'admin'
  );
  console.log('Estudantes criados com role de admin (problema):', createdStudentsWithWrongRole.length > 0 ? 'SIM' : 'NÃO');

  console.log('\n=== Debug Concluído ===');
}

runDebug();
