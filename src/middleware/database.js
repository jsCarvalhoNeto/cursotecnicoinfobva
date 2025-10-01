import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuração da conexão com o banco de dados
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'informatica_wave'
};

// Middleware para criar conexão com banco de dados
export const dbConnectionMiddleware = async (req, res, next) => {
  try {
    req.db = await mysql.createConnection(dbConfig);
    await req.db.beginTransaction();
    console.log('Conexão com banco de dados estabelecida e transação iniciada');
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    res.status(500).json({ error: 'Erro ao conectar ao banco de dados.' });
    return;
 }
  next();
};

// Middleware para commit/rollback da transação
export const transactionMiddleware = async (req, res, next) => {
  const originalSend = res.send;
  
  // Flag para controlar se a transação já foi finalizada
  let transactionFinished = false;
  
  const finishTransaction = async () => {
    if (transactionFinished) return;
    transactionFinished = true;
    
    try {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await req.db?.commit();
      } else {
        await req.db?.rollback();
      }
    } catch (error) {
      console.error('Erro ao finalizar transação:', error);
    } finally {
      await req.db?.end();
    }
  };
  
  res.send = async function(data) {
    await finishTransaction();
    return originalSend.call(this, data);
  };
  
  res.on('finish', async () => {
    if (!transactionFinished) {
      await finishTransaction();
    }
  });
  
  res.on('close', async () => {
    if (!transactionFinished) {
      await finishTransaction();
    }
  });
  
  next();
};

// Função auxiliar para rollback em caso de erro
export const rollbackOnError = async (db) => {
  try {
    await db?.rollback();
  } catch (rollbackError) {
    console.error('Erro ao fazer rollback:', rollbackError);
  }
};
