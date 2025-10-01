import mysql from 'mysql2/promise';

async function testTransaction() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'josedo64_sisctibalbina'
    });

    console.log('=== Testando transação de criação de professor ===');

    // Iniciar transação
    await connection.beginTransaction();
    console.log('Transação iniciada');

    // Criar usuário
    const [userResult] = await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      ['test.transaction@email.com', 'senha123']
    );
    console.log('Usuário criado, ID:', userResult.insertId);

    // Criar perfil
    await connection.execute(
      'INSERT INTO profiles (user_id, full_name) VALUES (?, ?)',
      [userResult.insertId, 'Teste Transação']
    );
    console.log('Perfil criado');

    // Atribuir papel de professor
    await connection.execute(
      'INSERT INTO user_roles (user_id, role) VALUES (?, ?)',
      [userResult.insertId, 'teacher']
    );
    console.log('Papel atribuído');

    // Commit da transação
    await connection.commit();
    console.log('Transação commitada');

    // Verificar se os dados foram salvos
    const [verification] = await connection.execute(`
      SELECT u.id, u.email, p.full_name, ur.role
      FROM users u
      JOIN profiles p ON u.id = p.user_id
      JOIN user_roles ur ON u.id = ur.user_id
      WHERE u.email = ?
    `, ['test.transaction@email.com']);
    
    console.log('Dados verificados:', verification);

    await connection.end();
    console.log('Conexão fechada');
  } catch (error) {
    console.error('Erro na transação:', error.message);
    // Não fazemos rollback aqui pois já estamos no catch
  }
}

testTransaction();
