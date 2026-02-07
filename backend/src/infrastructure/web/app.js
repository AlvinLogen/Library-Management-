const express = require('express');
const cors = require('cors');

/**
 * Creates and configures Express application
 * @param {Object} dependencies - Injected dependencies (controllers, middleware)
 * @returns {Express.Application}
*/

function createApp(dependencies = {}){
    const app = express();

    // Middleware - body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true}));

    // Middleware - cors
    app.use(cors({
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Middleware - request logging
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
        next();
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'book-library-api'
        });
    });

    // API routes
    if (dependencies.bookRoutes){
        app.use('/api/books', dependencies.bookRoutes);
    }

    if(dependencies.authorRoutes){
        app.use('/api/authors', dependencies.authorRoutes);
    }

    if(dependencies.borrowRoutes){
        app.use('/api/borrows', dependencies.borrowRoutes);
    }

    // 404 Handler
    app.use((req, res) => {
        res.status(404).json({
            error: {
                message: 'Route not found',
                statusCode: 404,
                path: req.path
            }
        });
    });

    // Error handling middlware (must be last)
    app.use((err, req, res, next) => {
        console.error('Error', err);

        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';

        res.status(statusCode).json({
            error: {
                message, 
                statusCode, 
                timestamp: new Date().toISOString()
            }
        })
    });

    return app;
}

module.exports = createApp;