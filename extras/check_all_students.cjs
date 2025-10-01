const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkAllStudents() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'informatica_wave'
  });
  
  try {
    // Verificar todos os estudantes e suas matrículas
    const [students] = await conn.execute(`
      SELECT u.id, u.email, p.full_name
      FROM users u 
      JOIN profiles p ON u.id = p.user_id
      JOIN user_roles ur ON u.id = ur.user_id 
      WHERE ur.role = 'student'
    `);
    
    console.log('Estudantes no sistema:');
    for (let student of students) {
      const [enrollments] = await conn.execute(
        'SELECT COUNT(*) as count FROM enrollments WHERE student_id = ?',
        [student.id]
      );
      console.log(`ID: ${student.id}, Email: ${student.email}, Nome: ${student.full_name}, Matrículas: ${enrollments[0].count}`);
      
      // Se tiver matrículas, mostrar detalhes
      if (enrollments[0].count > 0) {
        const [subjects] = await conn.execute(`
          SELECT s.name, s.schedule, p.full_name as teacher_name
          FROM subjects s
          INNER JOIN enrollments e ON s.id = e.subject_id
          LEFT JOIN profiles p ON s.teacher_id = p.user_id
          WHERE e.student_id = ?
        `, [student.id]);
        
        console.log('  Disciplinas matriculadas:');
        subjects.forEach(subj => {
          console.log(`    - ${subj.name} (Professor: ${subj.teacher_name || 'Não atribuído'}, Horário: ${subj.schedule})`);
        });
      }
    }
    
  } finally {
    await conn.end();
  }
}

checkAllStudents().catch(console.error);
