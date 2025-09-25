const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function testStudentSubjects() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'informatica_wave'
  });
  
  try {
    // Testar a consulta para o estudante ID 12 que tem matrícula
    const [studentSubjects] = await conn.execute(`
      SELECT s.*, p.full_name as teacher_name, e.enrollment_date
      FROM subjects s
      INNER JOIN enrollments e ON s.id = e.subject_id
      LEFT JOIN profiles p ON s.teacher_id = p.user_id
      WHERE e.student_id = ?
      ORDER BY s.created_at DESC
    `, [12]);
    
    console.log('Disciplinas do estudante ID 12:', studentSubjects);
    
    // Verificar detalhes da disciplina ID 1
    const [subjectDetails] = await conn.execute('SELECT * FROM subjects WHERE id = 1');
    console.log('Detalhes da disciplina ID 1:', subjectDetails[0]);
    
    // Verificar detalhes do professor da disciplina ID 1
    const [subjectWithTeacher] = await conn.execute(`
      SELECT s.*, p.full_name as teacher_name
      FROM subjects s
      LEFT JOIN profiles p ON s.teacher_id = p.user_id
      WHERE s.id = 1
    `);
    console.log('Disciplina com professor:', subjectWithTeacher[0]);
    
  } finally {
    await conn.end();
  }
}

testStudentSubjects().catch(console.error);
