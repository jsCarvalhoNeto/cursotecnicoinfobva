import mysql from 'mysql2/promise';

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'josedo64_sisctibalbina'
    });

    console.log('Conexão com o banco de dados bem-sucedida!');

    // Testar se as tabelas existem
    const [usersResult] = await connection.execute('SELECT COUNT(*) as count FROM users LIMIT 1');
    console.log('Tabela users acessível');

    const [profilesResult] = await connection.execute('SELECT COUNT(*) as count FROM profiles LIMIT 1');
    console.log('Tabela profiles acessível');

    const [user_rolesResult] = await connection.execute('SELECT COUNT(*) as count FROM user_roles LIMIT 1');
    console.log('Tabela user_roles acessível');

    await connection.end();
    console.log('Conexão fechada com sucesso');
  } catch (error) {
    console.error('Erro na conexão ou consulta:', error.message);
  }
}

testConnection();
