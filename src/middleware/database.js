import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { mockDbUtils } from '../lib/mockDatabase.js';

dotenv.config();

// Configuração da conexão com o banco de dados
export const dbConfig = {
  host: process.env.DB_HOST || 'mysql.railway.internal',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'hKqzfPhyDJLAJujRUPjZebecKknlbMVN',
  database: process.env.DB_NAME || 'railway',
  port: process.env.DB_PORT || 3306,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
};

// Função para testar conexão com MySQL
async function testMySQLConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.end();
    return true;
  } catch (error) {
    console.log('MySQL não disponível, usando banco de dados mockado:', error.message);
    return false;
  }
}

// Middleware para criar conexão com banco de dados ou usar mock
export const dbConnectionMiddleware = async (req, res, next) => {
  try {
    // Testar conexão com MySQL
    const mysqlAvailable = await testMySQLConnection();
    
    if (mysqlAvailable) {
      // Usar MySQL real
      req.db = await mysql.createConnection(dbConfig);
      await req.db.beginTransaction();
      req.dbType = 'mysql';
      console.log('Conexão com banco de dados MySQL estabelecida e transação iniciada');
    } else {
      // Usar banco de dados mockado
      req.db = mockDbUtils;
      req.dbType = 'mock';
      console.log('Usando banco de dados mockado');
    }
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    res.status(500).json({ error: 'Erro ao conectar ao banco de dados.' });
    return;
  }
  next();
};

// Middleware para commit/rollback da transação (ou operações mockadas)
export const transactionMiddleware = async (req, res, next) => {
  const originalSend = res.send;
  
  // Flag para controlar se a transação já foi finalizada
  let transactionFinished = false;
  
  const finishTransaction = async () => {
    if (transactionFinished) return;
    transactionFinished = true;
    
    try {
      if (req.dbType === 'mysql') {
        // Operações para MySQL real
        if (res.statusCode >= 20 && res.statusCode < 300) {
          await req.db?.commit();
        } else {
          await req.db?.rollback();
        }
        await req.db?.end();
      } else {
        // Para mock, não há transações reais
        console.log('Operações mockadas concluídas');
      }
    } catch (error) {
      console.error('Erro ao finalizar transação:', error);
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
    if (db && db.rollback) {
      await db.rollback();
    }
  } catch (rollbackError) {
    console.error('Erro ao fazer rollback:', rollbackError);
  }
};
