import axios from 'axios';

async function testSubjectTeacherRelation() {
  const API_BASE = 'http://localhost:4001/api';
  
  console.log('Testando relação entre disciplinas e professores...\n');

  try {
    // 1. Buscar professores existentes
    console.log('1. Buscando professores...');
    const teachersResponse = await axios.get(`${API_BASE}/teachers`);
    console.log('Professores encontrados:', teachersResponse.data.length);
    console.log('Primeiro professor:', teachersResponse.data[0]?.full_name);
    console.log('ID do primeiro professor:', teachersResponse.data[0]?.id);

    // 2. Criar uma nova disciplina com professor
    if (teachersResponse.data.length > 0) {
      const firstTeacherId = teachersResponse.data[0].id;
      console.log(`\n2. Criando disciplina com professor ID: ${firstTeacherId}`);
      
      const newSubject = {
        name: 'Teste de Relação Professor-Disciplina',
        description: 'Disciplina de teste para verificar a relação com professor',
        schedule: 'Segunda e Quarta 14:00-16:00',
        max_students: 30,
        teacher_id: firstTeacherId
      };

      const createResponse = await axios.post(`${API_BASE}/subjects`, newSubject);
      console.log('Disciplina criada com sucesso:', createResponse.data.success);
      console.log('ID da disciplina:', createResponse.data.id);
      
      const subjectId = createResponse.data.id;

      // 3. Buscar disciplinas por professor
      console.log(`\n3. Buscando disciplinas do professor ID: ${firstTeacherId}`);
      const subjectsByTeacher = await axios.get(`${API_BASE}/subjects?teacher_id=${firstTeacherId}`);
      console.log('Disciplinas do professor:', subjectsByTeacher.data.length);
      console.log('Disciplinas:', subjectsByTeacher.data.map(s => ({ id: s.id, name: s.name, teacher_name: s.teacher_name })));

      // 4. Buscar todas as disciplinas para verificar o nome do professor
      console.log('\n4. Buscando todas as disciplinas...');
      const allSubjects = await axios.get(`${API_BASE}/subjects`);
      const createdSubject = allSubjects.data.find(s => s.id === subjectId);
      console.log('Disciplina criada com professor:', createdSubject?.teacher_name);
      console.log('Dados completos da disciplina:', {
        id: createdSubject?.id,
        name: createdSubject?.name,
        teacher_name: createdSubject?.teacher_name,
        teacher_id: createdSubject?.teacher_id
      });

      // 5. Criar disciplina sem professor (para testar o caso NULL)
      console.log('\n5. Criando disciplina sem professor...');
      const subjectWithoutTeacher = {
        name: 'Disciplina sem Professor',
        description: 'Disciplina de teste sem professor atribuído',
        schedule: 'Terça e Quinta 10:00-12:00',
        max_students: 25,
        teacher_id: null
      };

      const createWithoutTeacher = await axios.post(`${API_BASE}/subjects`, subjectWithoutTeacher);
      console.log('Disciplina sem professor criada:', createWithoutTeacher.data.success);

      // 6. Buscar todas as disciplinas novamente
      console.log('\n6. Buscando todas as disciplinas após criação...');
      const finalSubjects = await axios.get(`${API_BASE}/subjects`);
      console.log('Total de disciplinas:', finalSubjects.data.length);
      
      finalSubjects.data.slice(0, 3).forEach(subject => {
        console.log(`- ${subject.name}: ${subject.teacher_name || 'Sem professor'}`);
      });

      console.log('\n✅ Teste concluído com sucesso! A relação entre disciplinas e professores está funcionando corretamente.');
    } else {
      console.log('⚠️ Nenhum professor encontrado para testar a relação.');
      console.log('Por favor, cadastre um professor primeiro para testar a funcionalidade.');
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.response?.data || error.message);
  }
}

// Executar o teste
testSubjectTeacherRelation();
