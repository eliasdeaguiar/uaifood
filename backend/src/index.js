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
const dishOfTheDayRoutes = require('./routes/dishOfTheDay.routes.js');
const messageRoutes = require('./routes/message.routes.js');
const reviewRoutes = require('./routes/review.routes.js');
const addressRoutes = require('./routes/address.routes.js');
const orderRoutes = require('./routes/order.routes.js');

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
app.use('/dishes-of-the-day', dishOfTheDayRoutes);
app.use('/messages', messageRoutes);
app.use('/reviews', reviewRoutes);
app.use('/addresses', addressRoutes);
app.use('/orders', orderRoutes);

// (Aqui adicionaremos as outras rotas: /address, /items, /orders, etc)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`); 
});