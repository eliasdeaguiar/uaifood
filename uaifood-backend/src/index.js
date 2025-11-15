// src/index.js
const express = require('express');
require('dotenv').config(); // Carrega o .env (Lab V)

// Configs do Swagger (Lab IV)
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');

// Rotas
const userRoutes = require('./routes/user.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Rota da Documentação (Lab IV)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota principal de Usuários (Lab I e III)
app.use('/users', userRoutes);

// (Aqui adicionaremos as outras rotas: /address, /items, /orders, etc)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); 
});