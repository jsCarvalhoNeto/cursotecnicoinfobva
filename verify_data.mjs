import mysql from 'mysql2/promise';

async function verifyData() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'josedo64_sisctibalbina'
    });

    console.log('=== Verificando dados no banco ===');

    // Verificar usuários
    const [users] = await connection.execute('SELECT * FROM users WHERE email LIKE ?', ['%prof.teste%']);
    console.log('Usuários encontrados:', users);

    // Verificar perfis
    const [profiles] = await connection.execute(`
      SELECT p.*, u.email 
      FROM profiles p 
      JOIN users u ON p.user_id = u.id 
      WHERE u.email LIKE ?
    `, ['%prof.teste%']);
    console.log('Perfis encontrados:', profiles);

    // Verificar papéis
    const [roles] = await connection.execute(`
      SELECT ur.*, u.email 
      FROM user_roles ur 
      JOIN users u ON ur.user_id = u.id 
      WHERE u.email LIKE ?
    `, ['%prof.teste%']);
    console.log('Papéis encontrados:', roles);

    // Também verificar o outro email de teste
    const [users2] = await connection.execute('SELECT * FROM users WHERE email LIKE ?', ['%test.transaction%']);
    console.log('Usuários encontrados (outro teste):', users2);

    // Verificar a consulta que a API usa
    const [apiQueryResult] = await connection.execute(`
      SELECT u.id, u.email, p.full_name, u.created_at
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE ur.role = 'teacher'
      ORDER BY u.created_at DESC
      LIMIT 10
    `);
    console.log('Resultado da consulta da API:', apiQueryResult);

    await connection.end();
    console.log('Conexão fechada');
  } catch (error) {
    console.error('Erro na verificação:', error.message);
  }
}

verifyData();
