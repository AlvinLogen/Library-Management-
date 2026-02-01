const BorrowRecord = require('../../../domain/entities/BorrowRecord');

/**
 * BorrowBook Use Case
 * Handles book borrowing workflow with business rules
 * 
 * Design by Contract:
 * @precondition: bookId and userId must be valid, book must be available
 * @postcondition: Book availability decremented, BorrowRecord created
 */

class BorrowBook {
    constructor(bookRepository, borrowRecordRepository){
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    async execute({ bookId, userId, dueDate}){
        // Precondition: Input validation
        if(!bookId || bookId <= 0){
            throw new Error('Valid book ID is required');
        }

        if(!userId || userId <= 0){
            throw new Error('Valid user ID is required');
        }

        if(!dueDate){
            throw new Error('Due date is required');
        }

        // Convert dueDate to Date object if string
        const dueDateObj = dueDate instanceof Date ? dueDate : new Date(dueDate);
        
        if(isNaN(dueDateObj)){
            throw new Error('Invalid due date');
        }

        // Get Book Entity
        const book = await this.bookRepository.findById(bookId);
        
        if(!book){
            throw new Error(`Book with ID ${bookId} not found`);
        }

        // Business Rule: Check if book can be borrowed (uses entity method)
        if(!book.canBorrow()){
            throw new Error('No copies available for borrowing');
        }

        // Business Rule: Borrow the book (uses entity method - returns new immutable instance)
        const updatedBook = book.borrow();

        // Create BorrowRecord Entity
        const borrowRecord = new BorrowRecord({
            bookId,
            userId,
            borrowDate: new Date(),
            dueDate: dueDateObj,
            status: BorrowRecord.STATUS.BORROWED
        });

        // Save both entities (coordination of 2 repositories)
        await this.bookRepository.save(updatedBook);
        const savedBorrowRecord = await this.borrowRecordRepository.save(borrowRecord);

        return savedBorrowRecord;
    }
}

module.exports = BorrowBook;