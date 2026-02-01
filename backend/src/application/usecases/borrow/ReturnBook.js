/**
 * ReturnBook Use Case
 * Handles book return with late fee calculation
 * 
 * Design by Contract:
 * @precondition: borrowId must be valid, book must be currently borrowed
 * @postcondition: Book availability incremented, BorrowRecord updated with return date
 */

class ReturnBook {
    constructor(bookRepository, borrowRecordRepository){
        this.bookRepository = bookRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    async execute({ borrowId, returnDate = new Date()}){
        // Precondition: Input validation
        if(!borrowId || borrowId <= 0){
            throw new Error('Valid borrow ID is required');
        }

        // Convert returnDate to Date object if string
        const returnDateObj = returnDate instanceof Date ? returnDate : new Date(returnDate);
        if(isNaN(returnDateObj)){
            throw new Error('Invalid return date');
        }

        // Get BorrowRecord entity
        const borrowRecord = await this.borrowRecordRepository.findById(borrowId);
        if(!borrowRecord){
            throw new Error(`Borrow record with ID ${borrowId} not found`);
        }

        // Business rule: Cannot return already returned book
        if(borrowRecord.isReturned){
            throw new Error('Book has already been returned');
        }

        // Get the Book entity
        const book = await this.bookRepository.findById(borrowRecord.bookId);
        if(!book){
            throw new Error(`Book with ID ${borrowRecord.bookId} not found`);
        }

        // Business rule: Return the book (uses entity method - increments availableCopies)
        const updatedBook = book.returnCopy();

        // Business rule: Mark borrow record as returned (uses entity method)
        const updatedBorrowRecord = borrowRecord.markAsReturned(returnDateObj);

        // Calculate late fee if overdue 
        const lateFee = updatedBorrowRecord.isOverdue ? updatedBorrowRecord.calculateLateFee(5.00) : 0;

        // Save entities
        await this.bookRepository.save(updatedBook);
        await this.borrowRecordRepository.save(updatedBorrowRecord);

        return {
            borrowRecord: updatedBorrowRecord,
            lateFee, 
            message: lateFee > 0 ? `Book returned with late fee: ${lateFee.toFixed(2)}` : `Book returned on time`
        }
    }
}

module.exports = ReturnBook;