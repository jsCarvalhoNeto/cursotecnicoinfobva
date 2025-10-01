import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 4001; // Usando porta diferente para evitar conflitos

console.log('=== Iniciando servidor de debug ===');

// Configurações do CORS para permitir requisições do seu frontend
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log('Requisição recebida:', req.method, req.path);
  next();
});

// Rota de teste
app.get('/api', (req, res) => {
  console.log('Rota /api acessada');
  res.send('API do Portal do Curso Técnico está funcionando!');
});

// Rota para criar um novo professor
app.post('/api/teachers', async (req, res) => {
  console.log('Rota POST /api/teachers acessada');
  console.log('Body:', req.body);
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ error: 'Nome completo, email e senha são obrigatórios.' });
  }

  res.status(201).json({ success: true, full_name, email });
});

// Rota para buscar todos os professores
app.get('/api/teachers', async (req, res) => {
  console.log('Rota GET /api/teachers acessada');
  res.status(200).json([]);
});

// Rota para disciplinas (mantendo para comparação)
app.get('/api/subjects', async (req, res) => {
  console.log('Rota GET /api/subjects acessada');
  res.status(200).json([]);
});

app.listen(port, () => {
  console.log(`Servidor de debug rodando na porta ${port}`);
 console.log('Rotas disponíveis:');
  console.log(' GET  /api');
  console.log('  GET  /api/teachers');
  console.log('  POST /api/teachers');
  console.log(' GET  /api/subjects');
});
