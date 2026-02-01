const Author = require('../../../domain/entities/Author');

/**
 * CreateAuthor Use Case
 * Creates a new author with validation
 * 
 * Design by Contract:
 * @precondition: firstName, lastName, and birthDate must be valid
 * @postcondition: Returns saved Author entity with authorId
*/

class CreateAuthor {
    constructor(authorRepository){
        this.authorRepository = authorRepository;
    }

    async execute({ firstName, lastName, birthDate, biography = null, nationality = null}){
        // Precondition: Input Validation
        if(!firstName || !lastName){
            throw new Error('First name and last name are required');
        }

        if(!birthDate){
            throw new Error('Birth date is required');
        }

        // Convert birthDate to Date object if it's a string
        const birthDateObj = birthDate instanceof Date ? birthDate : new Date(birthDate);

        if(isNaN(birthDateObj)){
            throw new Error('Invalid birth date');
        }

        // Create new Author entity (entity validates itself)
        const author = new Author({
            firstName, 
            lastName, 
            birthDate: birthDateObj,
            biography,
            nationality
        });

        // Save to database via repository
        const savedAuthor = await this.authorRepository.save(author);

        return savedAuthor;
    }
}

module.exports = CreateAuthor;