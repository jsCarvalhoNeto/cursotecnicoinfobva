import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;

// Configurações do CORS para permitir requisições do seu frontend
app.use(cors());
app.use(express.json());

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: '108.167.132.74',
  user: 'josedo64_sisctibalbina',
  password: '!@N14o15v22O15!@',
  database: 'josedo64_sisctibalbina'
};

// Rota de teste
app.get('/api', (req, res) => {
  res.send('API do Portal do Curso Técnico está funcionando!');
});

// Rota para criar uma nova disciplina
app.post('/api/subjects', async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'O nome da disciplina é obrigatório.' });
  }

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO subjects (name) VALUES (?)',
      [name]
    );
    res.status(201).json({ success: true, id: result.insertId, name });
  } catch (error) {
    console.error('Erro ao inserir disciplina:', error);
    res.status(500).json({ error: 'Erro ao conectar ou inserir no banco de dados.' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

// Rota para buscar todas as disciplinas
app.get('/api/subjects', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT * FROM subjects ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
    res.status(500).json({ error: 'Erro ao buscar dados do banco de dados.' });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
