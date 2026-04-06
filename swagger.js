const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Finance Backend API',
      version: '1.0.0',
      description: 'API documentation for Finance Backend application',
    },
    servers: [
      {
        url: 'https://finance-backend-k1lg.onrender.com',
      },
      {
        url: 'http://localhost:5000',
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
      schemas: {

        User: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
            isActive: { type: 'boolean' }
          }
        },

        Record: {
          type: 'object',
          properties: {
            amount: { type: 'number' },
            type: { type: 'string' },
            category: { type: 'string' },
            date: { type: 'string' },
            notes: { type: 'string' }
          }
        },

        LoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            password: { type: 'string' }
          }
        },

        LoginResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' }
          }
        },

        SummaryResponse: {
          type: 'object',
          properties: {
            totalIncome: { type: 'number' },
            totalExpense: { type: 'number' },
            netBalance: { type: 'number' }
          }
        }

      },
    },
    security: [{ bearerAuth: [] }]
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(options);

module.exports = { swaggerUi, specs };