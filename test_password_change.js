import fetch from 'node-fetch';

async function testPasswordChange() {
  try {
    console.log('Testando alteração de senha...');
    
    // Primeiro, fazer login para obter um usuário existente
    const loginResponse = await fetch('http://localhost:4001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'aluno1@teste.com', // Usuário de teste existente
        password: 'senha123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.success && loginData.user) {
      const userId = loginData.user.id;
      console.log(`Usuário autenticado: ${userId}`);
      
      // Testar alteração de senha com newPassword (o formato que o frontend envia)
      const changePasswordResponse = await fetch(`http://localhost:4001/api/students/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: 'novaSenha123'
        })
      });
      
      const passwordChangeData = await changePasswordResponse.json();
      console.log('Alteração de senha response:', passwordChangeData);
      
      if (changePasswordResponse.ok) {
        console.log('✓ Alteração de senha funcionando corretamente com newPassword!');
      } else {
        console.log('✗ Erro na alteração de senha com newPassword:', passwordChangeData);
      }
      
      // Testar alteração de senha com password (para compatibilidade)
      const changePasswordResponse2 = await fetch(`http://localhost:4001/api/students/${userId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: 'outraNovaSenha123'
        })
      });
      
      const passwordChangeData2 = await changePasswordResponse2.json();
      console.log('Alteração de senha (password) response:', passwordChangeData2);
      
      if (changePasswordResponse2.ok) {
        console.log('✓ Alteração de senha funcionando corretamente com password!');
      } else {
        console.log('✗ Erro na alteração de senha com password:', passwordChangeData2);
      }
    } else {
      console.log('Não foi possível fazer login para testar. Tentando com ID manual...');
      
      // Teste com ID manual (substitua por um ID real de estudante existente)
      const testUserId = '1'; // Ajuste conforme necessário
      
      const changePasswordResponse = await fetch(`http://localhost:4001/api/students/${testUserId}/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newPassword: 'testeSenha123'
        })
      });
      
      const passwordChangeData = await changePasswordResponse.json();
      console.log('Teste com ID manual response:', passwordChangeData);
      
      if (changePasswordResponse.ok) {
        console.log('✓ Alteração de senha funcionando corretamente!');
      } else {
        console.log('✗ Erro na alteração de senha:', passwordChangeData);
      }
    }
    
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testPasswordChange();
