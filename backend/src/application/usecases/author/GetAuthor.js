/**
 * GetAuthor Use Case
 * Retrieves author by ID with error handling
 * 
 * Design by Contract:
 * @precondition: authorId must be a positive integer
 * @postcondition: Returns Author entity or throw error if not found
*/

class GetAuthor {
    constructor(authorRepository){
        // Dependancy Injection
        this.authorRepository = authorRepository;
    }

    async execute(authorId){
        // Precondition: Input Validation
        if(!authorId || authorId <= 0){
            throw new Error('Valid author ID is required');
        }

        // Repository call
        const author = await this.authorRepository.findById(authorId);

        // Business rule: Author must exist
        if(!author){
            throw new Error(`Author with ID ${authorId} not found`);
        }

        // Postcondition: Return Author entity
        return author;
    }
}

module.exports = GetAuthor;