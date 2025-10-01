const testData = {
  fullName: 'Teste Estudante API',
  email: 'test.student.api@email.com',
  studentRegistration: '2024TEST001',
  password: 'senha123'
};

async function testStudentCreation() {
  try {
    console.log('=== Testando criação de estudante via API ===');
    console.log('Dados de teste:', testData);

    const response = await fetch('http://localhost:4001/api/students', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    const result = await response.json();
    console.log('Resposta da API:', result);

    if (response.ok) {
      console.log('✅ Estudante criado com sucesso via API!');
      
      // Testar busca do estudante criado
      console.log('\n=== Testando busca do estudante criado ===');
      const getResponse = await fetch(`http://localhost:4001/api/students/${result.id}`);
      const studentData = await getResponse.json();
      console.log('Dados do estudante buscado:', studentData);

      // Testar listagem de estudantes
      console.log('\n=== Testando listagem de estudantes ===');
      const listResponse = await fetch('http://localhost:4001/api/students');
      const studentsList = await listResponse.json();
      console.log('Lista de estudantes:', studentsList);
    } else {
      console.log('❌ Erro na criação do estudante:', result.error);
    }
 } catch (error) {
    console.error('Erro na requisição:', error.message);
  }
}

testStudentCreation();
