/**
 * BorrowController
 * Handles HTTP requests for borrow operations
 * Maps HTTP Layer to application use cases
 * 
 * Features: Borrow book, return book, get overdue book, get history, get statistics, get active borrows
*/

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
    async borrowBook(req, res, next) {
        try {
            const { bookId, userId, dueDate } = req.body;

            // Validation
            if (!bookId || !userId) {
                return res.status(400).json({
                    error: 'Book ID and User ID are required'
                });
            }

            const borrow = await this.borrowBookUseCase.execute({
                bookId: parseInt(bookId, 10),
                userId: parseInt(userId, 10),
                dueDate: dueDate ? new Date(dueDate) : null
            });

            res.status(201).json(borrow);

        } catch (error) {
            next(error);
        }
    }

    /**
    * PUT /api/borrows/:id/return
    * Return a borrowed book
    */
    async returnBook(req, res, next) {
        try {
            const { id } = req.params;
            const borrowId = parseInt(id, 10);

            if (isNaN(borrowId)) {
                return res.status(400).json({
                    error: 'Invalid borrow ID'
                });
            }

            const borrow = await this.returnBookUseCase.execute({ borrowId });
            res.json(borrow);

        } catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/borrows/overdue
     * Get all overdue books
     */
    async getOverdue(req, res, next) {
        try {
            const overdueBooks = await this.getOverdueBooksUseCase.execute();
            res.json(overdueBooks);
        } catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/borrows/history/:userId
     * Get borrow history for a user
     */
    async getUserHistory(req, res, next) {
        try {
            const { userId } = req.params;
            const userIdInt = parseInt(userId, 10);

            if (isNaN(userIdInt)) {
                return res.status(400).json({
                    error: 'Invalid user ID'
                });
            }

            const history = await this.getUserBorrowHistoryUseCase.execute({
                userId: userIdInt
            });

            res.json(history);

        } catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/borrows/statistics
     * Get borrow statistics (analytics dashboard)
     */
    async getStatistics(req, res, next) {
        try {
            const statistics = await this.getBorrowStatisticsUseCase.execute();
            res.json(statistics);

        } catch (error) {
            next(error);
        }
    }
    /**
     * GET /api/borrows/active
     * Get all active borrows
     */
    async getActive(req, res, next) {
        try {
            const activeBorrows = await this.getActiveBorrowsUseCase.execute();
            res.json(activeBorrows);

        } catch (error) {
            next(error);
        }
    }

    async getActiveByUser(req, res, next) {
        try {
            const { userId } = req.params;
            const userIdInt = userId ? parseInt(userId, 10) : null;

            if(isNaN(userIdInt)){
                return res.status(400).json({
                    error: 'Invalid user ID'
                });
            }

            const userActiveBorrows = await this.getActiveBorrowsUseCase.execute(userIdInt);
            res.json(userActiveBorrows);

        } catch (error) {
            next(error);
        }
    }
}

module.exports = BorrowController;