const prisma = require('../prismaCLient');
const bcrypt = require('bcrypt');
const jwtConfig = require('../config/jwtConfig');
const { userSchema, loginSchema } = require('../schemas/user.schema')

const createuser = async (req, res) =>{
    const validade = userSchema.safeParse(req, res)
}