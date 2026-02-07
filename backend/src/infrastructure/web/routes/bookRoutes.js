const express = require('express');
const router = express.Router();

/**
 * Book Routes
 * Defines HTTP endpoints for book operations
 * @param {BookController} bookController - Injected controller
*/

function createBookRoutes(bookController){
    // Special routes (must be before :id routes)
    router.get('/analytics', (req, res, next) => {
        bookController.getAnalytics(req, res, next);
    });

    router.get('/categories/hierarchy', (req, res, next) => {
        bookController.getCategoryHierarchy(req, res, next);
    });

    // Search/List books - Get /api/books
    router.get('/', (req, res, next) => {
        bookController.search(req, res, next);
    });

    // Get book by ID - GET /api/books/:id
    router.get('/:id', (req, res, next) => {
        bookController.getById(req, res, next);
    });

    // Create book - POST /api/books
    router.post('/', (req, res, next) => {
        bookController.create(req, res, next);
    });

    // Update book - PUT /api/books/Lid
    router.put('/:id', (req, res, next) => {
        bookController.update(req, res, next);
    });

    // Delete book - DELETE /api/books/:id
    router.delete('/:id', (req, res, next) => {
        bookController.delete(req, res, next);
    });

    return router;
}

module.exports = createBookRoutes;