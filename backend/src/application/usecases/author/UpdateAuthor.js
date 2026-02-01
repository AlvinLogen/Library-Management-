const Author = require('../../../domain/entities/Author');

/**
 * UpdateAuthor Use Case
 * Updates an existing author
 * 
 * Design by Contract:
 * @precondition: authorId must exist, updated data must be valid
 * @postcondition: Returns updated Author entity
*/

class UpdateAuthor {
    constructor(authorRepository){
        this.authorRepository = authorRepository;
    }

    async execute({ authorId, firstName, lastName, birthDate, biography, nationality}){
        // Precondition: validate authorId
        if(!authorId || authorId <= 0){
            throw new Error('Valid author ID is required');
        }

        // Check if author exists
        const existingAuthor = await this.authorRepository.findById(authorId);

        if(!existingAuthor){
            throw new Error(`Author with ID ${authorId} not found`);
        }

        // Use entity's immutable update method
        const updatedAuthor = existingAuthor.update({
            firstName: firstName ?? existingAuthor.firstName,
            lastName: lastName ?? existingAuthor.lastName,
            birthDate: birthDate ?? existingAuthor.birthDate,
            biography: biography ?? existingAuthor.biography,
            nationality: nationality ?? existingAuthor.nationality
        });

        // Save updated entity
        const savedAuthor = await this.authorRepository.save(updatedAuthor);

        // Postcondition: Return updated entity
        return savedAuthor;
    }
}

module.exports = UpdateAuthor;