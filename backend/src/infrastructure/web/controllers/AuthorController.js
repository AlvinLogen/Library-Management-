/**
 * AuthorController
 * Handles HTTP requests for author operations
 * Maps HTTP Layer to application use cases
 * 
 * PATTERN: Thin controller - validates HTTP input, calls use cases, returns HTTP response
 * SOLID: Single Responsibility 
*/

const { asyncHandler } = require('../middleware/errorHandler');
const { ValidationError, NotFoundError } = require('../../../domain/errors/AppError');

class AuthorController {
    constructor({
        getAuthorUseCase,
        createAuthorUseCase,
        updateAuthorUseCase,
        deleteAuthorUseCase
    }) {
        this.getAuthorUseCase = getAuthorUseCase;
        this.createAuthorUseCase = createAuthorUseCase;
        this.updateAuthorUseCase = updateAuthorUseCase;
        this.deleteAuthorUseCase = deleteAuthorUseCase;
    }

    /**
     * GET /api/authors/:id
     * Get author by ID
     */
    getById = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const authorId = parseInt(id, 10);

        if (isNaN(authorId)) {
            throw new ValidationError('Invalid author ID', ['Author ID must be a valid number']);
        }

        const author = await this.getAuthorUseCase.execute({ authorId });

        if (!author) {
            throw new NotFoundError('Author', authorId);
        }

        res.json(author);
    });

    /**
     * POST /api/authors
     * Create a new author
     */
    create = asyncHandler(async (req, res) => {
        const authorData = req.body;
        const errors = [];

        if (!authorData.firstName) errors.push('First name is required');
        if (!authorData.lastName) errors.push('Last name is required');

        if (errors.length > 0) {
            throw new ValidationError('Invalid author data', errors);
        }

        const author = await this.createAuthorUseCase.execute(authorData);
        res.status(201).json(author);
    });

    /**
     * PUT /api/authors/:id
     * Update an author
     */
    update = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const authorId = parseInt(id, 10);
        const updateData = req.body;

        if (isNaN(authorId)) {
            throw new ValidationError('Invalid author ID', ['Author ID must be a valid number']);
        }

        const author = await this.updateAuthorUseCase.execute({
            authorId,
            ...updateData
        });

        res.json(author);
    });

    /**
     * DELETE /api/authors/:id
     * Delete an author
     */
    delete = asyncHandler(async (req, res) => {
        const { id } = req.params;
        const authorId = parseInt(id, 10);

        if (isNaN(authorId)) {
            throw new ValidationError('Invalid author ID', ['Author ID must be a valid number']);
        }

        await this.deleteAuthorUseCase.execute({ authorId });
        res.status(204).send();
    });
}

module.exports = AuthorController;