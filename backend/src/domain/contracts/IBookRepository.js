/**
 * IBookRepository - Repository pattern interface
 * Defines contract for book persistence operations
 */

class IBookRepository {
    /**
     * Find book by ID
     * @precondition: bookId must be a positive integer
     * @postcondition: Returns Book entity or null if not found
     */
    async findbyId(bookId){
        throw new Error('Method not implemented');
    }

    /**
     * Find books by criteria with pagination
     * @precondition: page >= 1, pageSize >= 1, pageSize <= 100
     * @postcondition: Returns array of Book entities
     */
    async findByCriteria({ searchTerm, categoryId, authorId, page, pageSize}){
        throw new Error('Method not implemented');
    }

    /**
     * Get book analytics using advanced T-SQL
     * @postcondition: Returns analytics object with rankings and trends
     */
    async getAnalytics(){
        throw new Error('Method not implemented');
    }

    /**
     * Get category hierarchy with book counts
     * @postcondition: Returns hierarchical category structure
     */
    async getCategoryHierarchy() {
        throw new Error('Method not implemented');
    }

    /**
     * Save book (create or update)
     * @precondition: book must be valid Book entity
     * @postcondition: Returns saved Book entity with bookId
     */
    async save(book){
        throw new Error('Method not implemented');
    }

    /**
     * Delete book by ID
     * @precondition: bookId must exist
     * @postcondition: Book is removed from persistence
     */
    async deleteById(bookId){
        throw new Error('Method not implemented');
    }
}

module.exports = IBookRepository;