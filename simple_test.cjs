// Teste direto da rota de alteração de senha
const http = require('http');

// Teste 1: Tentar alterar senha com newPassword
const postData1 = JSON.stringify({
  newPassword: 'novaSenha123'
});

const options1 = {
  hostname: 'localhost',
  port: 4001,
  path: '/api/students/1/password',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData1)
  }
};

console.log('Testando alteração de senha com newPassword...');
const req1 = http.request(options1, (res) => {
 console.log(`Status: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log('Resposta:', chunk.toString());
  });
 res.on('end', () => {
    console.log('Teste 1 concluído');
    
    // Teste 2: Tentar alterar senha com password
    const postData2 = JSON.stringify({
      password: 'outraSenha123'
    });

    const options2 = {
      hostname: 'localhost',
      port: 4001,
      path: '/api/students/1/password',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData2)
      }
    };

    console.log('\nTestando alteração de senha com password...');
    const req2 = http.request(options2, (res) => {
      console.log(`Status: ${res.statusCode}`);
      res.on('data', (chunk) => {
        console.log('Resposta:', chunk.toString());
      });
      res.on('end', () => {
        console.log('Teste 2 concluído');
        console.log('\n✓ Testes de alteração de senha concluídos!');
      });
    });

    req2.on('error', (error) => {
      console.error('Erro no teste 2:', error);
    });

    req2.write(postData2);
    req2.end();
  });
});

req1.on('error', (error) => {
  console.error('Erro no teste 1:', error);
});

req1.write(postData1);
req1.end();
