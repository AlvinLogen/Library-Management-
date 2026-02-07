const express = require('express');
const router = express.Router();

/**
 * Borrow Routes
 * Defines HTTP endpoints for operations
 * 
 * @param {BorrowController} borrowController = Injected controller
 * @returns {Router} Express router with routes configured
*/

function createBorrowRoutes(borrowController){
    // Special routes FIRST (before :id routes)
    // These must come before /:id or Express will treat overdue as an ID

    // GET /api/borrows/overdue - Get overdue books
    router.get('/overdue', (req, res, next) => {
        borrowController.getOverdue(req, res, next);
    });

    // GET /api/borrows/statistics - Get statistics
    router.get('/statistics', (req, res, next) => {
        borrowController.getStatistics(req, res, next);
    });

    // GET /api/borrows/active - Get active borrows
    router.get('/active', (req, res, next) => {
        borrowController.getActive(req, res, next);
    });

    // GET /api/borrows/active/:userId - Get active borrows by user Id
    router.get('/active/:userId', (req, res, next) => {
        borrowController.getActiveByUser(req, res, next);
    });


    // GET /api/borrows/history/:userId - Get users borrow history
    router.get('/history/:userId', (req, res, next) => {
        borrowController.getUserHistory(req, res, next);
    });

    // POST /api/borrows - Borrow a book
    router.post('/', (req, res, next) => {
        borrowController.borrowBook(req, res, next);
    });

    // PUT /api/borrows/:id/return - Return a book
    router.put('/:id/return', (req, res, next) => {
        borrowController.returnBook(req, res, next);
    });

    return router;
}

module.exports = createBorrowRoutes;