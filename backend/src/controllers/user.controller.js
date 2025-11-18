// src/controllers/user.controller.js
const prisma = require('../prismaClient'); // Nome correto do arquivo é prismaClient
const bcrypt = require('bcrypt');
const jwtConfig = require('../config/jwtConfig');
const { userSchema, loginSchema } = require('../schemas/user.schema');

const createUser = async (req, res) => {
  // BUG 1 CORRIGIDO: Era (req, res), agora é (req.body) 
  const validade = userSchema.safeParse(req.body); 

  if (!validade.success) {
    // BUG 2 CORRIGIDO: Adicionado () em .format()
    return res.status(400).json({ error: validade.error.format() });
  }

  const { name, phone, password, userType } = validade.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // [cite: 267]

    const newUser = await prisma.user.create({
      data: {
        name,
        phone,
        password: hashedPassword,
        userType,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    // Adicionado log de erro para debugging
    console.error("ERRO AO CRIAR USUÁRIO:", error);

    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Telefone já cadastrado.' });
    }
    // Corrigido para retornar a mensagem de erro que você já tinha
    res.status(400).json({ error: 'Erro ao criar usuário' });
  }
};

const login = async (req, res) => {
  const validade = loginSchema.safeParse(req.body);
  if (!validade.success) {
    // BUG 2 CORRIGIDO: Adicionado () em .format()
    return res.status(400).json({ error: validade.error.format() });
  }

  const { phone, password } = validade.data;

  try {
    const user = await prisma.user.findUnique({ where: { phone } });

    // BUG 3 CORRIGIDO: Trocado ValidityState por uma mensagem de erro
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciais inválidas' }); // 
    }

    const token = jwtConfig.generateToken(user.id); // [cite: 287]
    res.status(200).json({ token }); // [cite: 288]
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    res.status(500).json({ error: 'Erro interno no login.' });
  }
};

// Middleware de Autenticação (Lab V)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // [cite: 304]

  if (token == null) return res.sendStatus(401); // [cite: 306]

  try {
    const user = jwtConfig.verifyToken(token); // [cite: 308]
    req.user = user; // [cite: 309]
    next(); // [cite: 310]
  } catch (error) {
    return res.status(403).json({ error: error.message }); // [cite: 312]
  }
};

// Função de Logout (Lab V)
const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // [cite: 339] (adaptado)
    
    if (token) {
      jwtConfig.blacklistToken(token); // [cite: 340]
    }
    
    // BUG 4 CORRIGIDO: Removida a linha de erro 500 que vinha depois
    res.status(200).json({ message: 'Logout realizado com sucesso' }); // [cite: 341]
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar logout.' }); // [cite: 344]
  }
};

// ADICIONE ESTA NOVA FUNÇÃO
const getMe = async (req, res) => {
  const userId = req.user.id; // Vem do middleware 'authenticateToken'

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      // Selecionamos SÓ os dados seguros (sem a senha)
      select: { 
        id: true,
        name: true,
        phone: true,
        userType: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("ERRO AO BUSCAR /me:", error);
    res.status(500).json({ error: 'Erro interno ao buscar dados do usuário.' });
  }
};

// ADICIONE ESTA NOVA FUNÇÃO (middleware)
const checkIsAdmin = async (req, res, next) => {
  const userId = req.user.id; // Pega o ID do middleware 'authenticateToken'

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { userType: true }
    });

    if (!user || user.userType !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para administradores.' });
    }

    // Se for admin, continue
    next();
  } catch (error) {
    console.error("ERRO AO VERIFICAR ADMIN:", error);
    res.status(500).json({ error: 'Erro interno ao verificar permissões.' });
  }
};

module.exports = {
  createUser,
  login,
  logout,
  authenticateToken,
  getMe,
  checkIsAdmin, // <--- ADICIONE AQUI
};