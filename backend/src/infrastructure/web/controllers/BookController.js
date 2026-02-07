/**
 * BookController Handles HTTP requests for book operations
 * Maps HTTP Layer to application use cases
*/

class BookController {
    constructor({
        getBookUseCase,
        searchBooksUseCase,
        createBookUseCase,
        updateBookUseCase,
        deleteBookUseCase,
        getBookAnalyticsUseCase,
        getCategoryHierarchyUseCase
    }) {
        this.getBookUseCase = getBookUseCase;
        this.searchBooksUseCase = searchBooksUseCase;
        this.createBookUseCase = createBookUseCase;
        this.updateBookUseCase = updateBookUseCase;
        this.deleteBookUseCase = deleteBookUseCase;
        this.getBookAnalyticsUseCase = getBookAnalyticsUseCase;
        this.getCategoryHierarchyUseCase = getCategoryHierarchyUseCase;
    }

    /**
     * Get /api/books/:id
     * Get book by ID
    */
    async getById(req, res, next) {
        try {
            const { id } = req.params;
            const bookId = parseInt(id, 10);

            if (isNaN(bookId)) {
                return res.status(400).json({
                    error: 'Invalid book ID'
                });
            }

            const book = await this.getBookUseCase.execute({ bookId });

            if (!book) {
                return res.status(404).json({
                    error: 'Book not found'
                });
            }

            res.json(book);

        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/books
     * Search books with filters and pagination
    */
    async search(req, res, next) {
        try {
            const {
                searchTerm = '',
                categoryId,
                authorId,
                page = 1,
                pageSize = 20
            } = req.query;

            const result = await this.searchBooksUseCase.execute({
                searchTerm,
                categoryId: categoryId ? parseInt(categoryId, 10) : null,
                authorId: authorId ? parseInt(authorId, 10) : null,
                page: parseInt(page, 10),
                pageSize: parseInt(pageSize, 10)
            });

            res.json(result);

        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/books
     * Create a new book
    */
    async create(req, res, next) {
        try {
            const bookData = req.body;

            // Basic validation
            if (!bookData.isbn || !bookData.title) {
                return res.status(400).json({
                    error: 'ISBN and title are required'
                });
            }

            const book = await this.createBookUseCase.execute(bookData);
            res.status(201).json(book);

        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/books/:id
     * Update a book
    */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const bookId = parseInt(id, 10);
            const updateData = req.body;

            if (isNaN(bookId)) {
                return res.status(400).json({
                    error: 'Invalid book ID'
                });
            }

            const book = await this.updateBookUseCase.execute({
                bookId,
                ...updateData
            });

            res.json(book);

        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/books/:id
     * Delete a book
    */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const bookId = parseInt(id, 10);

            if (isNaN(bookId)) {
                return res.status(400).json({
                    error: 'Invalid book ID'
                });
            }

            await this.deleteBookUseCase.execute({ bookId });
            res.status(204).send();

        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/books/analytics
     * Get book analytics (window functions, rankings)
    */
    async getAnalytics(req, res, next) {
        try {
            const analytics = await this.getBookAnalyticsUseCase.execute();
            res.json(analytics);
        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/books/categories/hierarchy
     * Get category hierarchy (recursive CTE)
    */
    async getCategoryHierarchy(req, res, next) {
        try {
            const hierarchy = await this.getCategoryHierarchyUseCase.execute();
            res.json(hierarchy);
        } catch (error) {
            next(error);
        }
    }

}

module.exports = BookController;