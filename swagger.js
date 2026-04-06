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
                        _id: { type: 'string', example: '60d5ecb74b24c72b8c8b4567' },
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'john@example.com' },
                        role: { type: 'string', example: 'viewer' },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                    }
                },

                Record: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d5ecb74b24c72b8c8b4568' },
                        amount: { type: 'number', example: 100.5 },
                        type: { type: 'string', example: 'income' },
                        category: { type: 'string', example: 'Salary' },
                        date: { type: 'string', format: 'date', example: '2024-01-01' },
                        notes: { type: 'string', example: 'Monthly salary' },
                        user: { type: 'string', example: '60d5ecb74b24c72b8c8b4567' },
                        isDeleted: { type: 'boolean', example: false },
                        createdAt: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' }
                    }
                },

                RegisterRequest: {
                    type: 'object',
                    required: ['username', 'email', 'password', 'confirmPassword'],
                    properties: {
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'john@example.com' },
                        password: { type: 'string', example: 'password123' },
                        confirmPassword: { type: 'string', example: 'password123' }
                    }
                },

                LoginRequest: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', example: 'john@example.com' },
                        password: { type: 'string', example: 'password123' }
                    }
                },

                LoginResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Login successful' },
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
                    }
                },

                RecordRequest: {
                    type: 'object',
                    required: ['amount', 'type', 'category', 'date'],
                    properties: {
                        amount: { type: 'number', example: 100.5 },
                        type: { type: 'string', enum: ['income', 'expense'], example: 'income' },
                        category: { type: 'string', example: 'Salary' },
                        date: { type: 'string', format: 'date', example: '2024-01-01' },
                        notes: { type: 'string', example: 'Monthly salary' }
                    }
                },

                RecordsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Record' }
                        },
                        total: { type: 'integer', example: 25 },
                        page: { type: 'integer', example: 1 },
                        totalPages: { type: 'integer', example: 3 }
                    }
                },

                SummaryResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        summary: {
                            type: 'object',
                            properties: {
                                totalIncome: { type: 'number', example: 5000.0 },
                                totalExpense: { type: 'number', example: 3000.0 },
                                netBalance: { type: 'number', example: 2000.0 }
                            }
                        }
                    }
                },

                CategoriesResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        categories: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: { type: 'string', example: 'Salary' },
                                    total: { type: 'number', example: 5000.0 }
                                }
                            }
                        }
                    }
                },

                TrendsResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        monthlyTrends: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'object',
                                        properties: {
                                            month: { type: 'integer', example: 1 },
                                            year: { type: 'integer', example: 2024 },
                                            type: { type: 'string', example: 'income' }
                                        }
                                    },
                                    total: { type: 'number', example: 1200.0 }
                                }
                            }
                        }
                    }
                },

                WeeklyTrendsResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        weeklyTrends: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    _id: {
                                        type: 'object',
                                        properties: {
                                            week: { type: 'integer', example: 1 },
                                            year: { type: 'integer', example: 2024 },
                                            type: { type: 'string', example: 'expense' }
                                        }
                                    },
                                    total: { type: 'number', example: 800.0 }
                                }
                            }
                        }
                    }
                },

                RecentTransactionsResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        recentTransactions: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Record' }
                        }
                    }
                },

                CreateUserRequest: {
                    type: 'object',
                    required: ['username', 'email', 'password'],
                    properties: {
                        username: { type: 'string', example: 'johndoe' },
                        email: { type: 'string', example: 'john@example.com' },
                        password: { type: 'string', example: 'password123' },
                        role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'analyst' }
                    }
                },

                UsersResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/User' }
                        },
                        total: { type: 'integer', example: 10 },
                        page: { type: 'integer', example: 1 },
                        totalPages: { type: 'integer', example: 1 }
                    }
                },

                UpdateRoleRequest: {
                    type: 'object',
                    required: ['role'],
                    properties: {
                        role: { type: 'string', enum: ['viewer', 'analyst', 'admin'], example: 'admin' }
                    }
                },

                UpdateStatusRequest: {
                    type: 'object',
                    required: ['isActive'],
                    properties: {
                        isActive: { type: 'boolean', example: true }
                    }
                },

                ErrorResponse: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Internal server error' }
                    }
                },

                ValidationErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        errors: {
                            type: 'array',
                            items: { type: 'string' },
                            example: ['Email is required', 'Password must be at least 6 characters long']
                        }
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