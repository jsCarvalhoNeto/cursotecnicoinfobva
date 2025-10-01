async function testAllSubjects() {
  try {
    const response = await fetch('http://localhost:4001/api/subjects');
    const data = await response.json();
    
    console.log('Total de disciplinas:', data.length);
    console.log('Todas as disciplinas:');
    data.forEach((subject, index) => {
      console.log(`${index + 1}. ${subject.name} - Professor: ${subject.teacher_name || 'Não atribuído'}`);
    });
  } catch (error) {
    console.error('Erro:', error);
  }
}

testAllSubjects();
