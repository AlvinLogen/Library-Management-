/**
 * IAuthorRepository - Repository pattern interface
 * Defines contract for author persistence operations
 */

class IAuthorRepository {
    /**
     * Find author by ID
     * @precondition: authorId must be a positive integer
     * @postcondition: Returns Author entity or null if not found
     */
    async findById(authorId){
        throw new Error('Method not implemented');
    }

    /**
     * Find authors by criteria with pagination
     * @precondition: page >= 1, pageSize >= 1, pageSize <= 100
     * @postcondition: Returns array of Author entities
     */
    async findByCriteria({ searchTerm, country, page, pageSize}) {
        throw new Error('Method not implemented')
    }

    /**
     * Save author (create or update)
     * @precondition: author must be valid Author entity
     * @postcondition: Returns saved Author entity with authorId
     */
    async save(author){
        throw new Error('Method not implemented');
    }

    /**
     * Delete author by ID
     * @precondition: authorId must exist
     * @postcondition: Author is removed from persistence
     */
    async deleteById(authorId){
        throw new Error('Method not implemented');
    }
}

module.exports = IAuthorRepository;