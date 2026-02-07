/**
 * AuthorController
 * Handles HTTP requests for author operations
 * Maps HTTP Layer to application use cases
 * 
 * PATTERN: Thin controller - validates HTTP input, calls use cases, returns HTTP response
 * SOLID: Single Responsibility 
*/

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
    async getById(req, res, next) {
        try {
            // 1. Extract and validate HTTP request
            const { id } = req.params;
            const authorId = parseInt(id, 10);

            if (isNaN(authorId)) {
                return res.status(400).json({
                    error: 'Invalid author ID'
                });
            }

            // 2. Call use case / business logic
            const author = await this.getAuthorUseCase.execute({ authorId });

            // 3. handle use case / business logic result
            if (!author) {
                return res.status(404).json({
                    error: 'Author not found'
                });
            }

            // 4. Return HTTP response
            res.json(author);

        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/authors
     * Create a new author
    */
    async create(req, res, next) {
        try {
            const authorData = req.body;

            if(!authorData.firstName || !authorData.lastName){
                return res.status(400).json({
                    error: 'First name and last name are required'
                });
            }

            const author = await this.createAuthorUseCase.execute(authorData);
            res.status(201).json(author);

        } catch (error) {
            next(error);
        }
    }

    /**
     * PUT /api/authors/:id
     * Update an author
    */
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const authorId = parseInt(id, 10);
            const updateData = req.body;

            if(isNaN(authorId)){
                return res.status(400).json({
                    error: 'Invalid author ID'
                });
            }

            const author = await this.updateAuthorUseCase.execute({
                authorId,
                ...updateData
            });

            res.json(author);

        } catch (error) {
            next(error);
        }
    }

    /**
     * DELETE /api/authors/:id
     * Delete an author
    */
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const authorId = parseInt(id, 10);

            if(isNaN(authorId)){
                return res.status(400).json({
                    error: 'Invalid author ID'
                });
            }

            await this.deleteAuthorUseCase.execute({authorId});
            res.status(204).send();

        } catch (error) {
            next(error);
        }
    }

}

module.exports = AuthorController;