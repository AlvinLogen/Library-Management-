/**
 * DeleteAuthor Use Case
 * Deletes an author by ID
 * 
 * Design by Contract:
 * @precondition: authorId must be valid and author must exist
 * @postcondition: Author is deleted, returns true
 * 
*/

class DeleteAuthor {
    constructor(authorRepository){
        this.authorRepository = authorRepository;
    }

    async execute(authorId){
        // Precondition: Validate authorId
        if(!authorId || authorId <= 0){
            throw new Error('Valid author ID is required');
        }

        // Check if author exists
        const existingAuthor = await this.authorRepository.findById(authorId);

        if(!existingAuthor){
            throw new Error(`Author with ID: ${authorId} not found`);
        }

        // Cascade Delete handled in database
        // Delete via repository
        await this.authorRepository.deleteById(authorId);

        return true;
    }
}

module.exports = DeleteAuthor;