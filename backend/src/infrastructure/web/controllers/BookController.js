/**
 * BookController Handles HTTP requests for book operations
 * Maps HTTP Layer to application use cases
*/

const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError, NotFoundError } = require('../../../domain/errors/AppError');

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
    getById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const bookId = parseInt(id, 10);

        if (isNaN(bookId)) {
            throw new ValidationError('Invalid book ID', ['Book ID must be a valid number']);
        }

        const book = await this.getBookUseCase.execute({ bookId });

        if (!book) {
            throw new NotFoundError('Book', bookId);
        }

        res.json(book);
    });

    /**
     * GET /api/books
     * Search books with filters and pagination
    */
    search = asyncHandler(async (req, res) => {
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
    });

    /**
     * POST /api/books
     * Create a new book
    */
    create = asyncHandler(async (req, res) => {
        const bookData = req.body;
        const errors = [];

        if(!bookData.isbn) errors.push('ISBN is required');
        if(!bookData.title) errors.push('Title is required');
        if(bookData.isbn && bookData.isbn.length !== 13) {
            errors.push('ISBN must be exactly 13 characters');
        }

        // Basic validation
        if (errors.length > 0) {
            throw new ValidationError('Invalid book data', errors);
        }

        const book = await this.createBookUseCase.execute(bookData);
        res.status(201).json(book);
    });

    /**
     * PUT /api/books/:id
     * Update a book
    */
    update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const bookId = parseInt(id, 10);
        const updateData = req.body;

        if (isNaN(bookId)) {
            throw new ValidationError('Invalid book ID', ['Book ID must be a valid number']);
        }

        const book = await this.updateBookUseCase.execute({
            bookId,
            ...updateData
        });

        res.json(book);
    });

    /**
     * DELETE /api/books/:id
     * Delete a book
    */
    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const bookId = parseInt(id, 10);

        if (isNaN(bookId)) {
            throw new ValidationError('Invalid book ID', ['Book ID must be a valid number']);
        }

        await this.deleteBookUseCase.execute({ bookId });
        res.status(204).send();
    });

    /**
     * GET /api/books/analytics
     * Get book analytics (window functions, rankings)
    */
    getAnalytics = asyncHandler(async (req, res) => {
        const analytics = await this.getBookAnalyticsUseCase.execute();
        res.json(analytics);
    });

    /**
     * GET /api/books/categories/hierarchy
     * Get category hierarchy (recursive CTE)
    */
    getCategoryHierarchy = asyncHandler(async (req, res) => {
        const hierarchy = await this.getCategoryHierarchyUseCase.execute();
        res.json(hierarchy);
    });

}

module.exports = BookController;