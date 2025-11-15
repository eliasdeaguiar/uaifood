const prisma = require('../prismaCLient');
const bcrypt = require('bcrypt');
const jwtConfig = require('../config/jwtConfig');
const { userSchema, loginSchema } = require('../schemas/user.schema')

const createUser = async (req, res) =>{
    const validade = userSchema.safeParse(req, res)

    if(!validade.success){
        return res.status(400).json({error: validade.error.format})
    }

    const { name, phone, password, userType } = validade.data;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
                userType
            },
        });
        res.status(201).json(newUser);
    }catch(error){
        if (error.code === 'P2002'){
            return res.status(409).json({ error: 'Telefone já cadastrado.'})
        }
        res.status(400).json({ error: 'Erro ao criar usuário'})
    }
};

const login = async (req, res) => {
    const validade = loginSchema.safeParse(req.body);
    if(!validade.success){
        return res.status(400).json({error: validade.error.format});
    }

    const { phone, password } = validade.data;

    try {
        const user = await prisma.user.findUnique({ where: {phone} })

        if(!user || !(await bcrypt.compare(password, user.password))){
            return res.status(400).json({ error: ValidityState.error.format()})
        }

        const token = jwtConfig.generateToken(user.id);
        res.status(200).json({ token })

    }catch (error){
        res.status(500).json({ error: 'Erro interno no login.'})
    }
};

// Middleware de Autenticação (Lab V)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  try {
    const user = jwtConfig.verifyToken(token);
    req.user = user; // Salva o payload do user (que é o {id}) na requisição
    next();
  } catch (error) {
    return res.status(403).json({ error: error.message }); // Token inválido ou na blacklist [cite: 56]
  }
};

// Função de Logout (Lab V
const logout = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      jwtConfig.blacklistToken(token); // [cite: 84]
    }
    res.status(200).json({ message: 'Logout realizado com sucesso' });
    res.status(500).json({ error: 'Erro ao realizar logout.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao realizar logout.' });
  }
};

module.exports = {
  createUser,
  login,
  logout,
  authenticateToken,
};