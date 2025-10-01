const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function addTestEnrollment() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'informatica_wave'
  });
  
  try {
    // Obter um estudante existente (ID 9 ou 12)
    const [students] = await conn.execute('SELECT id FROM users u JOIN user_roles ur ON u.id = ur.user_id WHERE ur.role = "student" LIMIT 1');
    
    // Obter uma disciplina existente
    const [subjects] = await conn.execute('SELECT id FROM subjects LIMIT 1');
    
    if (students.length > 0 && subjects.length > 0) {
      const studentId = students[0].id;
      const subjectId = subjects[0].id;
      
      console.log(`Criando matrícula para estudante ${studentId} na disciplina ${subjectId}`);
      
      // Verificar se já existe uma matrícula para evitar duplicatas
      const [existing] = await conn.execute(
        'SELECT id FROM enrollments WHERE student_id = ? AND subject_id = ?',
        [studentId, subjectId]
      );
      
      if (existing.length === 0) {
        // Criar uma nova matrícula
        const [result] = await conn.execute(
          'INSERT INTO enrollments (student_id, subject_id) VALUES (?, ?)',
          [studentId, subjectId]
        );
        
        console.log('Matrícula criada com sucesso:', result);
        
        // Verificar a matrícula criada
        const [enrollment] = await conn.execute(
          'SELECT * FROM enrollments WHERE id = ?',
          [result.insertId]
        );
        
        console.log('Matrícula criada:', enrollment[0]);
      } else {
        console.log('Matrícula já existe para este estudante e disciplina');
      }
    } else {
      console.log('Não há estudantes ou disciplinas suficientes para criar uma matrícula de teste');
    }
    
  } finally {
    await conn.end();
  }
}

addTestEnrollment().catch(console.error);
