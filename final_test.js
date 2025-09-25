/**
 * Teste final para verificar o sistema completo de autenticação
 */

import { mockDbUtils, mockDatabase } from './src/lib/mockDatabase.js';
import { createStudent } from './src/services/studentService.js';

async function runFinalTest() {
  console.log('=== Teste Final de Autenticação ===\n');

  // Limpar dados de testes anteriores
  mockDatabase.users = mockDatabase.users.filter(u => !u.email.includes('debug') && !u.email.includes('teste'));
  mockDatabase.profiles = mockDatabase.profiles.filter(p => !p.email.includes('debug') && !p.email.includes('teste'));
  mockDatabase.roles = mockDatabase.roles.filter(r => !mockDatabase.users.find(u => u.id === r.user_id));

  console.log('1. Estado inicial (após limpeza):');
  console.log('Total de usuários:', mockDatabase.users.length);
  console.log('Usuários:', mockDatabase.users.map(u => ({ id: u.id, email: u.email, role: u.role })));

  // Testar criação de estudante
  console.log('\n2. Criando novo estudante...');
  const studentData = {
    fullName: 'Aluno Teste Final',
    email: 'aluno.teste@final.com',
    studentRegistration: '2024FINAL001'
  };

  const result = await createStudent(studentData);
  console.log('Resultado da criação:', result);

  if (result.success && result.user) {
    console.log('\n3. Verificando dados do estudante criado:');
    console.log('  - ID:', result.user.id);
    console.log('  - Email:', result.user.email);
    console.log('  - Senha temporária:', result.user.temporaryPassword);
    console.log('  - Comprimento da senha:', result.user.temporaryPassword.length);

    // Verificar se o usuário foi armazenado corretamente
    const storedUser = mockDbUtils.getUserByEmail(result.user.email);
    console.log('\n4. Usuário no banco de dados:');
    console.log(' - Encontrado:', !!storedUser);
    console.log(' - ID:', storedUser?.id);
    console.log('  - Email:', storedUser?.email);
    console.log(' - Role:', storedUser?.role);
    console.log(' - Senha armazenada:', storedUser?.password);
    console.log(' - Senhas coincidem:', storedUser?.password === result.user.temporaryPassword);

    // Testar login
    console.log('\n5. Testando login com credenciais geradas...');
    const loginAttempt = mockDbUtils.getUserByEmail(result.user.email);
    if (loginAttempt && loginAttempt.password === result.user.temporaryPassword) {
      console.log('  ✅ LOGIN BEM-SUCEDIDO!');
      console.log('  - O estudante pode fazer login com as credenciais geradas');
      console.log(' - A senha temporária foi armazenada corretamente');
    } else {
      console.log('  ❌ LOGIN FALHOU!');
      console.log('  - Senha no banco:', loginAttempt?.password);
      console.log('  - Senha esperada:', result.user.temporaryPassword);
    }

    // Verificar roles
    console.log('\n6. Verificando roles...');
    const userRoles = mockDbUtils.getRolesByUserId(result.user.id);
    console.log('  - Roles do usuário:', userRoles);
    console.log('  - Tem role de estudante:', userRoles.some(r => r.role === 'student'));
    console.log('  - Tem role de admin:', userRoles.some(r => r.role === 'admin'));
    console.log('  - Tem role de teacher:', userRoles.some(r => r.role === 'teacher'));

    // Testar com login real (simulando o que acontece no useAuth)
    console.log('\n7. Simulando login real (como no useAuth)...');
    const email = result.user.email;
    const password = result.user.temporaryPassword;
    const userInDb = mockDbUtils.getUserByEmail(email);
    
    if (userInDb && userInDb.password === password) {
      console.log('  ✅ Login simulado funcionou!');
      console.log('  - Email encontrado:', userInDb.email);
      console.log('  - Role:', userInDb.role);
      console.log('  - Senha correta:', userInDb.password === password);
    } else {
      console.log('  ❌ Login simulado falhou!');
    }
  } else {
    console.log('Falha na criação do estudante:', result.error);
  }

  // Verificar estado final
  console.log('\n8. Estado final do sistema:');
  console.log('Total de usuários:', mockDatabase.users.length);
  const newUsers = mockDatabase.users.filter(u => u.email.includes('final'));
  console.log('Usuários de teste:', newUsers.map(u => ({ id: u.id, email: u.email, role: u.role })));

  console.log('\n=== Teste Final Concluído ===');
  console.log('Se todos os testes acima mostraram ✅, o sistema está funcionando corretamente!');
}

runFinalTest().catch(console.error);
