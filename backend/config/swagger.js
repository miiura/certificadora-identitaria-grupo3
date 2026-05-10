import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API do Portal ELLP',
            version: '1.0.0',
            description: 'Documentação oficial da API de gerenciamento de voluntários do projeto ELLP.',
            contact: {
                name: 'Grupo 3 - UTFPR'
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de Desenvolvimento',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Onde o Swagger deve procurar pela documentação?
    apis: ['./routes/*.js'], // Ele vai ler todos os arquivos dentro da pasta routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('📄 Documentação do Swagger disponível em http://localhost:3000/api-docs');
};