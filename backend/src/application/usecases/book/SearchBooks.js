/**
 * SearchBooks Use Case
 * Searches books with optional filters and pagination
 * 
 * Design by Contract:
 * @precondition: page >= 1, pageSize between 1 and 100
 * @postcondition: Returns array of Book entities
 */
class SearchBooks {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }

    async execute({ searchTerm = '', categoryId = null, authorId = null, page = 1, pageSize = 20 }) {
        // Precondition: Validate pagination
        if (page < 1) {
            throw new Error('Page must be greater than 0');
        }

        if (pageSize < 1 || pageSize > 100) {
            throw new Error('Page size must be between 1 and 100');
        }

        // Call repository with filters
        const books = await this.bookRepository.findByCriteria({
            searchTerm,
            categoryId,
            authorId,
            page,
            pageSize
        });

        // Postcondition: Return array of Book entities (can be empty)
        return books;
    }
}

module.exports = SearchBooks;