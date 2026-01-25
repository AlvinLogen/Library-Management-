/**
 * Use Case: Search Books - Orchestrates book search with T-SQL queries
 */

class SearchBooks {
    constructor(bookRepository){
        this.bookRepository = bookRepository;
    }

    // Execute Search - Return results with pagination
    async execute({ searchTerm = '', categoryId = null, authorId = null, page = 1, pageSize = 20}) {
        this.#validateInput({ page, pageSize});

        const books = await this.bookRepository.findByCriteria({
            searchTerm, 
            categoryId, 
            authorId, 
            page, 
            pageSize
        });

        const totalCount = await this.bookRepository.countByCriteria({
            searchTerm, 
            categoryId, 
            authorId
        });

        // Return DTO
        return {
            books: books.map(book => book.toJSON()),
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize)
            }
        };
    }

    #validateInput({ page, pageSize}){
        if (page < 1) throw new Error('Page must be at least 1');
        if (pageSize < 1 || pageSize > 100) throw new Error('Page size must be between 1 and 100');
    }
}

module.exports = SearchBooks;