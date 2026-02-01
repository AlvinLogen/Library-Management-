const Book = require('../../../domain/entities/Book');

/**
 * UpdateBook Use Case
 * Updates an existing book
 * 
 * Design by Contract:
 * @precondition: bookId must exist, updated data must be valid
 * @postcondition: Returns updated Book entity
 */

class UpdateBook {
    constructor(bookRepository){
        this.bookRepository = bookRepository;
    }

    async execute({bookId, isbn, title, totalCopies, availableCopies, publicationDate, description}){
        // Precondition: validate bookId
        if(!bookId || bookId <= 0 ){
            throw new Error('Valid book ID is required');
        }

        // Check if book exists
        const existingBook = await this.bookRepository.findById(bookId);

        if(!existingBook){
            throw new Error(`Book with ID ${bookId} not found`);
        }

        // Business rule: availableCopies cannot exceed totalCopies
        const newTotalCopies = totalCopies ?? existingBook.totalCopies;
        const newAvailableCopies = availableCopies ?? existingBook.availableCopies;

        if (newAvailableCopies > newTotalCopies) {
            throw new Error('Available copies cannot exceed total copies');
        }

        // Use entity's immutable update method
        const updatedBook = existingBook.update({
            isbn: isbn ?? existingBook.isbn,
            title: title ?? existingBook.title,
            totalCopies: newTotalCopies,
            availableCopies: newAvailableCopies,
            publicationDate: publicationDate ?? existingBook.publicationDate,
            description: description ?? existingBook.description
        });

        // Save updated entity
        const savedBook = await this.bookRepository.save(updatedBook);

        return savedBook;
    }
}

module.exports = UpdateBook;