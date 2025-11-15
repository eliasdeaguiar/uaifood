// src/index.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Carrega o .env (Lab V)

// Configs do Swagger (Lab IV)
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swaggerConfig');

// Rotas
const userRoutes = require('./routes/user.routes');
const categoryRoutes = require('./routes/category.routes.js'); // 1. ADICIONE ESTA LINHA
const itemRoutes = require('./routes/item.routes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// 2. ADICIONE ESTE BLOCO (antes de 'app.use(express.json())')
app.use(cors({
  origin: 'http://localhost:8080' // A porta do seu frontend
}));

app.use(express.json());

const uploadsFolder = path.resolve(__dirname, '..', 'public', 'uploads');
app.use('/files', express.static(uploadsFolder));

// Rota da Documentação (Lab IV)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rota principal de Usuários (Lab I e III)
app.use('/users', userRoutes);

app.use('/categories', categoryRoutes);
app.use('/items', itemRoutes);

// (Aqui adicionaremos as outras rotas: /address, /items, /orders, etc)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); 
});