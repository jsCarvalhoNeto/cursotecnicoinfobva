// Usando o fetch nativo do Node.js (disponível a partir do Node.js 18+)
// Se não estiver disponível, usaremos https

async function testApi() {
  try {
    const response = await fetch('http://localhost:3001/api/teachers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        full_name: 'Teste Professor',
        email: 'prof.teste@email.com',
        password: 'senha123'
      })
    });

    const result = await response.json();
    console.log('Resposta da API:', result);
    console.log('Status:', response.status);
  } catch (error) {
    console.error('Erro na requisição:', error.message);
  }
}

testApi();
