/**
 * GetBook Use Case
 * Retrieves book by ID with validation and error handling
 * 
 * Design by Contract:
 * @precondition: bookId must be a positive integer
 * @postcondition: Returns Book entity or throws error if not found
 * 
*/

class GetBook {
    constructor(bookRepository){
        this.bookRepository = bookRepository;
    }

    async execute(bookId){
        // Precondition: Input validation
        if(!bookId || bookId <= 0){
            throw new Error('Valid book ID is required');
        }

        // Call repository to get entity
        const book = await this.bookRepository.findById(bookId);

        // Business Rule: Book must exist
        if(!book){
            throw new Error(`Book with ID ${bookId} not found`);
        }

        // Postcondition: Return Book entity
        return book;
    }
}

module.exports = GetBook;