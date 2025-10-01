// Usando o fetch nativo do Node.js
async function testDeleteSubject() {
  try {
    // Primeiro, vamos buscar todas as disciplinas para ver quais existem
    console.log('Buscando disciplinas existentes...');
    const getResponse = await fetch('http://localhost:4001/api/subjects');
    const subjects = await getResponse.json();
    console.log('Disciplinas encontradas:', subjects);

    if (subjects.length > 0) {
      const subjectToDelete = subjects[0];
      console.log(`Tentando excluir disciplina: ${subjectToDelete.name} (ID: ${subjectToDelete.id})`);

      // Testar a exclusão
      const deleteResponse = await fetch(`http://localhost:4001/api/subjects/${subjectToDelete.id}`, {
        method: 'DELETE',
      });

      const result = await deleteResponse.json();
      console.log('Resposta da exclusão:', result);

      if (deleteResponse.ok) {
        console.log('✅ Exclusão bem-sucedida!');
        
        // Verificar se a disciplina foi realmente removida
        console.log('Verificando se a disciplina foi removida...');
        const getResponseAfterDelete = await fetch('http://localhost:4001/api/subjects');
        const subjectsAfterDelete = await getResponseAfterDelete.json();
        console.log('Disciplinas após exclusão:', subjectsAfterDelete.length);
        
        const stillExists = subjectsAfterDelete.find(sub => sub.id === subjectToDelete.id);
        if (!stillExists) {
          console.log('✅ Disciplina foi removida com sucesso do banco de dados!');
        } else {
          console.log('❌ Disciplina ainda existe no banco de dados!');
        }
      } else {
        console.log('❌ Falha na exclusão:', result.error);
      }
    } else {
      console.log('Nenhuma disciplina encontrada para excluir');
    }
  } catch (error) {
    console.error('Erro no teste:', error);
  }
}

testDeleteSubject();
