import mysql from 'mysql2/promise';

async function checkStudentsInDB() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'josedo64_sisctibalbina'
    });

    console.log('=== Verificando estudantes no banco de dados ===');

    // Verificar todos os estudantes
    const [students] = await connection.execute(`
      SELECT u.id, u.email, u.password, u.created_at, u.updated_at,
             p.full_name, p.student_registration,
             ur.role
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.role = 'student'
      ORDER BY u.created_at DESC
    `);
    console.log('Estudantes encontrados:', students);

    // Verificar o estudante específico que criamos
    const [specificStudent] = await connection.execute(`
      SELECT u.id, u.email, u.password, u.created_at, u.updated_at,
             p.full_name, p.student_registration,
             ur.role
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE u.email = 'test.student.api@email.com'
    `);
    console.log('Estudante específico (test.student.api@email.com):', specificStudent);

    // Verificar todos os usuários para ter uma visão completa
    const [allUsers] = await connection.execute(`
      SELECT u.id, u.email, u.created_at, u.updated_at, p.full_name, ur.role
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      ORDER BY u.created_at DESC
    `);
    console.log('Todos os usuários no sistema:', allUsers);

    await connection.end();
    console.log('Conexão fechada');
  } catch (error) {
    console.error('Erro na verificação:', error.message);
  }
}

checkStudentsInDB();
