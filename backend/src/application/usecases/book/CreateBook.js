const Book = require('../../../domain/entities/Book');

/**
 * CreateBook Use Case
 * Creates a new book with validation
 * 
 * Design by Contract:
 * @precondition: isbn, title, totalCopies must be valid
 * @postcondition: Returns saved Book entity with bookId
 */

class CreateBook {
    constructor(bookRepository){
        this.bookRepository = bookRepository;
    }

    async execute({isbn, title, totalCopies, publicationDate = null, description = null}){
        // Precondition: Input validation
        if(!isbn || !title){
            throw new Error('ISBN and title are required');
        }

        if(!totalCopies || totalCopies < 1){
            throw new Error('Total copies must be at least 1');
        }

        // Convert publicationDate to Date object if it's a string
        let publicationDateObj = null;
        if(publicationDate){
            publicationDateObj = publicationDate instanceof Date ? publicationDate : new Date(publicationDate);

            if(isNaN(publicationDateObj)){
                throw new Error('Invalid publication date');
            }
        }

        // Create new Book entity (availableCopies = totalCopies initially)
        const book = new Book({
            isbn, 
            title,
            totalCopies,
            availableCopies: totalCopies,
            publicationDate: publicationDateObj,
            description
        });

        // Save to database via repository
        const savedBook = await this.bookRepository.save(book);

        return savedBook;
    }
}

module.exports = CreateBook;