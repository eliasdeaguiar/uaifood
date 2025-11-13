const swaggerOptions = {
    defintion:{
        openapi: '3.0.0',
        info: {
            title: 'API UAIFood com Swagger',
            version: '1.0.0',
            description: 'Documentação da API do backend do projeto UAIFood',
        },
        servers: [
            {
                url: 'http://localhost:3003',
            },
        ],
    },
    apis: ['.src/routes/*.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions);
module.exports = swaggerDocs;