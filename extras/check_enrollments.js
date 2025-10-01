const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function checkEnrollments() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'informatica_wave'
  });
  
  try {
    // Verificar matrículas existentes
    const [enrollments] = await conn.execute('SELECT * FROM enrollments LIMIT 10');
    console.log('Matrículas encontradas:', enrollments);
    
    // Verificar disciplinas
    const [subjects] = await conn.execute('SELECT * FROM subjects LIMIT 10');
    console.log('Disciplinas encontradas:', subjects.length);
    
    // Verificar estudantes
    const [students] = await conn.execute('SELECT u.id, u.email, p.full_name FROM users u JOIN profiles p ON u.id = p.user_id JOIN user_roles ur ON u.id = ur.user_id WHERE ur.role = "student" LIMIT 10');
    console.log('Estudantes encontrados:', students.length);
    console.log('Estudantes:', students);
    
    // Testar a consulta que será usada na nova rota
    if (students.length > 0) {
      const studentId = students[0].id;
      console.log(`\nTestando consulta para estudante ID: ${studentId}`);
      
      const [studentSubjects] = await conn.execute(`
        SELECT s.*, p.full_name as teacher_name, e.enrollment_date
        FROM subjects s
        INNER JOIN enrollments e ON s.id = e.subject_id
        LEFT JOIN profiles p ON s.teacher_id = p.user_id
        WHERE e.student_id = ?
        ORDER BY s.created_at DESC
      `, [studentId]);
      
      console.log('Disciplinas do estudante:', studentSubjects);
    }
    
  } finally {
    await conn.end();
  }
}

checkEnrollments().catch(console.error);
