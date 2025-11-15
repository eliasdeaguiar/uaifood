const jwt = require('jsonwebtoken')

let blacklist = [];

const generateToken = (id) =>{
    return jwt.sign({ id }, process.env.SECRET_JWT, { expiresIn: '200h'});
};

const verifyToken = (token) => {
    if (blacklist.includes(token)){
        throw new Error('Token inválido');
    }
    return jwt.verify(token,process.env.SECRET_JWT);
};

const blacklistToken = (token) => {
    blacklist.push(token);
}

module.exports = {
    generateToken,
    verifyToken,
    blacklistToken,
};