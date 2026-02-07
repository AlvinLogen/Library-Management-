const express = require('express');
const router = express.Router();

/**
 * Author Routes
 * Defines HTTP endpoints for author operations
 * 
 * PATTERN: Factory function - accepts controller as dependancy
 * @param {AuthorController} authorController - Injected controller
 * @returns {Router} Express router with routes configured
*/

function createAuthorRoutes(authorController){
    // Get /api/authors/:id - Get author by ID
    router.get('/:id', (req, res, next) => {
        authorController.getById(req, res, next);
    });

    // Post /api/authors - Create an author
    router.post('/', (req, res, next) => {
        authorController.create(req, res, next);
    });

    // Put /api/authors/:id - Update an author
    router.put('/:id', (req, res, next) => {
        authorController.update(req, res, next);
    });

    // Delete /api/authors/:id - Delete an author
    router.delete('/:id', (req, res, next) => {
        authorController.delete(req, res, next);
    });
    return router;
}

module.exports = createAuthorRoutes;