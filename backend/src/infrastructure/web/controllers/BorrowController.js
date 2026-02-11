/**
 * BorrowController
 * Handles HTTP requests for borrow operations
 * Maps HTTP Layer to application use cases
 * 
 * Features: Borrow book, return book, get overdue book, get history, get statistics, get active borrows
*/

const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError, NotFoundError } = require('../../../domain/errors/AppError');

class BorrowController {
    constructor({
        borrowBookUseCase,
        returnBookUseCase,
        getOverdueBooksUseCase,
        getUserBorrowHistoryUseCase,
        getBorrowStatisticsUseCase,
        getActiveBorrowsUseCase
    }) {
        this.borrowBookUseCase = borrowBookUseCase;
        this.returnBookUseCase = returnBookUseCase;
        this.getOverdueBooksUseCase = getOverdueBooksUseCase;
        this.getUserBorrowHistoryUseCase = getUserBorrowHistoryUseCase;
        this.getBorrowStatisticsUseCase = getBorrowStatisticsUseCase;
        this.getActiveBorrowsUseCase = getActiveBorrowsUseCase;
    }

    /**
     * POST /api/borrows
     * Borrow a book
     * Body: { bookId, userId, dueDate }
     */
    borrowBook = asyncHandler(async (req, res) => {
        const { bookId, userId, dueDate } = req.body;
        const errors = [];

        if (!bookId) errors.push('Book ID is required');
        if (!userId) errors.push('User ID is required');

        if (errors.length > 0) {
            throw new ValidationError('Invalid borrow data', errors);
        }

        const borrow = await this.borrowBookUseCase.execute({
            bookId: parseInt(bookId, 10),
            userId: parseInt(userId, 10),
            dueDate: dueDate ? new Date(dueDate) : null
        });

        res.status(201).json(borrow);
    });

    /**
     * PUT /api/borrows/:id/return
     * Return a borrowed book
     */
    returnBook = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const borrowId = parseInt(id, 10);

        if (isNaN(borrowId)) {
            throw new ValidationError('Invalid borrow ID', ['Borrow ID must be a valid number']);
        }

        const borrow = await this.returnBookUseCase.execute({ borrowId });
        res.json(borrow);
    });

    /**
     * GET /api/borrows/overdue
     * Get all overdue books
     */
    getOverdue = asyncHandler(async (req, res) => {
        const overdueBooks = await this.getOverdueBooksUseCase.execute();
        res.json(overdueBooks);
    });

    /**
     * GET /api/borrows/history/:userId
     * Get borrow history for a user
     */
    getUserHistory = asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const userIdInt = parseInt(userId, 10);

        if (isNaN(userIdInt)) {
            throw new ValidationError('Invalid user ID', ['User ID must be a valid number']);
        }

        const history = await this.getUserBorrowHistoryUseCase.execute({
            userId: userIdInt
        });

        res.json(history);
    });

    /**
     * GET /api/borrows/statistics
     * Get borrow statistics (analytics dashboard)
     */
    getStatistics = asyncHandler(async (req, res) => {
        const statistics = await this.getBorrowStatisticsUseCase.execute();
        res.json(statistics);
    });

    /**
     * GET /api/borrows/active
     * Get all active borrows
     */
    getActive = asyncHandler(async (req, res) => {
        const activeBorrows = await this.getActiveBorrowsUseCase.execute();
        res.json(activeBorrows);
    });

    /**
     * GET /api/borrows/active/:userId
     * Get active borrows for a specific user
     */
    getActiveByUser = asyncHandler(async (req, res) => {
        const { userId } = req.params;
        const userIdInt = parseInt(userId, 10);

        if (isNaN(userIdInt)) {
            throw new ValidationError('Invalid user ID', ['User ID must be a valid number']);
        }

        const userActiveBorrows = await this.getActiveBorrowsUseCase.execute(userIdInt);
        res.json(userActiveBorrows);
    });
}

module.exports = BorrowController;