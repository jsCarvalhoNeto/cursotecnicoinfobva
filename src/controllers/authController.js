import { hashPassword, comparePassword, generateStudentRegistration } from './baseController.js';

// Controller para autenticação
export const authController = {
  // Rota para cadastro de novo usuário
 register: async (req, res) => {
    const { email, password, fullName, studentRegistration } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, senha e nome completo são obrigatórios.' });
    }

    try {
      // Verificar se o email já existe
      const [existingUser] = await req.db.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );
      if (existingUser.length > 0) {
        return res.status(400).json({ error: 'Email já está cadastrado.' });
      }

      // Gerar número de matrícula automaticamente se não for fornecido (para estudantes)
      let registrationToUse = studentRegistration;
      if (!registrationToUse) {
        registrationToUse = await generateStudentRegistration(req.db);
      }

      // Criar usuário
      const hashedPassword = await hashPassword(password);
      const [userResult] = await req.db.execute(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword]
      );

      // Criar perfil
      await req.db.execute(
        'INSERT INTO profiles (user_id, full_name, student_registration) VALUES (?, ?, ?)',
        [userResult.insertId, fullName, registrationToUse]
      );

      // Atribuir papel de estudante por padrão
      await req.db.execute(
        'INSERT INTO user_roles (user_id, role) VALUES (?, ?)',
        [userResult.insertId, 'student']
      );

      // Criar sessão (usando um cookie simples para esta implementação)
      res.cookie('sessionId', userResult.insertId, {
        httpOnly: true,
        secure: false, // Em produção, usar true com HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'strict'
      });

      // Retornar informações do usuário criado
      res.status(201).json({
        success: true,
        user: {
          id: userResult.insertId.toString(),
          email: email,
          role: 'student',
          full_name: fullName
        }
      });
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).json({ error: 'Erro ao criar usuário.' });
    }
 },

  // Rota para login de usuário
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    try {
      // Buscar usuário e suas informações
      const [users] = await req.db.execute(`
        SELECT u.id, u.email, u.password, p.full_name
        FROM users u
        LEFT JOIN profiles p ON u.id = p.user_id
        WHERE u.email = ?
      `, [email]);

      if (users.length === 0) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const user = users[0];

      // Verificar senha usando bcrypt
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Senha incorreta. Por favor, verifique sua senha e tente novamente.' });
      }

      // Buscar papel do usuário
      const [roles] = await req.db.execute(
        'SELECT role FROM user_roles WHERE user_id = ?',
        [user.id]
      );

      const userRole = roles.length > 0 ? roles[0].role : 'student';

      // Criar sessão (usando um cookie simples para esta implementação)
      res.cookie('sessionId', user.id, {
        httpOnly: true,
        secure: false, // Em produção, usar true com HTTPS
        maxAge: 24 * 60 * 60 * 1000, // 24 horas
        sameSite: 'strict'
      });

      // Retornar informações do usuário
      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: userRole,
          full_name: user.full_name
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).json({ error: 'Erro ao fazer login.' });
    }
  },

  // Rota para obter informações do usuário atual (baseado na sessão)
  getMe: async (req, res) => {
    // O middleware de autenticação já verificou a sessão e adicionou os dados do usuário
    // Buscar papel do usuário
    const [roles] = await req.db.execute(
      'SELECT role FROM user_roles WHERE user_id = ?',
      [req.userId]
    );

    const userRole = roles.length > 0 ? roles[0].role : 'student';

    // Buscar informações do usuário
    const [users] = await req.db.execute(`
      SELECT u.id, u.email, p.full_name
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      WHERE u.id = ?
    `, [req.userId]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Sessão inválida' });
    }

    const user = users[0];

    res.status(200).json({
      id: user.id,
      email: user.email,
      role: userRole,
      full_name: user.full_name
    });
  },

  // Rota para logout
  logout: async (req, res) => {
    res.clearCookie('sessionId');
    res.status(200).json({ success: true });
  }
};
