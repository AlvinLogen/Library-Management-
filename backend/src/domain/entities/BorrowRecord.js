/**
 * Borrowed Entity - Domain Model
 * Represents a book borrowing transaction in the library system
 * 
 * Design by Contract:
 * - Invariants: borrowDate <= dueDate, returnDate >= borrowDate (if exists)
 * - Business Rules: overdue calculation, return validation
*/

class BorrowRecord {
    #borrowId;
    #bookId;
    #userId;
    #borrowDate;
    #dueDate;
    #returnDate;
    #status;

    // Status Constants
    static STATUS = {
        BORROWED: 'Borrowed',
        RETURNED: 'Returned',
        OVERDUE: 'Overdue'
    };

    constructor({
        borrowId = null,
        bookId,
        userId,
        borrowDate = new Date(),
        dueDate,
        returnDate = null,
        status = BorrowRecord.STATUS.BORROWED
    }){
        this.#validateInvariants(borrowDate, dueDate, returnDate, status);

        this.#borrowId = borrowId;
        this.#bookId = bookId;
        this.#userId = userId;
        this.#borrowDate = borrowDate;
        this.#dueDate = dueDate;
        this.#returnDate = returnDate;
        this.#status = status;
    }

    // Invariant Validation
    #validateInvariants(borrowDate, dueDate, returnDate, status){

        // borrowDate must be a valid date
        if(!(borrowDate instanceof Date) || isNaN(borrowDate)){
            throw new Error('Borrow date must be a valid date');
        }

        // due must be a valid date and after borrowDate
        if(!(dueDate instanceof Date) || isNaN(dueDate)){
            throw new Error('Due date must be a valid date');
        }

        if(dueDate <= borrowDate){
            throw new Error('Due date must be after borrow date');
        }

        // returnDate validation
        if(returnDate !== null){
            if(!(returnDate instanceof Date) || isNaN(returnDate)){
                throw new Error('Return date must be a valid date');
            }

            if(returnDate < borrowDate){
                throw new Error('Return date cannot be before borrow date');
            }
        }

        // Status validation
        const validStatuses = Object.values(BorrowRecord.STATUS);
        if(!validStatuses.includes(status)){
            throw new Error(`Status must be one of: ${validStatuses.join(', ')}`);
        }
    }

    // Getters
    get borrowId() { return this.#borrowId; }
    get bookId() { return this.#bookId; }
    get userId() { return this.#userId; }
    get borrowDate() { return this.#borrowDate; }
    get dueDate() { return this.#dueDate; }
    get returnDate() { return this.#returnDate; }
    get status() { return this.#status; }

    // Computed properties (business logic)
    get isOverdue(){
        if(this.#returnDate !== null) return false; // Already returned
        return new Date() > this.#dueDate;
    }

    get daysOverdue(){
        if(!this.isOverdue) return 0;

        const today = new Date();
        const diffTime = today - this.#dueDate;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    get isReturned(){
        return this.#returnDate !== null;
    }

    /**
     * Mark book as returned
     * @precondition: Book not already returned (returnDate == null)
     * @postcondition: returnDate set, status updated to RETURNED
    */
    markAsReturned(returnDate = new Date()){
        if(this.#returnDate !== null){
            throw new Error('Book has already been returned');
        }

        if(returnDate < this.#borrowDate){
            throw new Error('Return date cannot be before borrow date');
        }

        // Return new instance (immutability)
        return new BorrowRecord({
            borrowId: this.#borrowId,
            bookId: this.#bookId,
            userId: this.#userId,
            borrowDate: this.#borrowDate,
            dueDate: this.#dueDate,
            returnDate: returnDate,
            status: BorrowRecord.STATUS.RETURNED
        });
    }

    /**
     * Calculate late fee
     * @param {number} feePerDay - Fee amount per day overdue
     * @returns {number} Total late fee
    */
    calculateLateFee(feePerDay = 0.50){
        if(!this.isOverdue && this.#returnDate === null) return 0;

        const daysLate = this.isReturned ? Math.max(0, Math.ceil((this.#returnDate - this.#dueDate) / (1000 * 60 * 60 * 24))) : this.daysOverdue;

        return daysLate * feePerDay;
    }

    // Update method (immutable pattern)
    update({ dueDate, status}){
        return new BorrowRecord({
            borrowId: this.#borrowId,
            bookId: this.#bookId,
            userId: this.#userId,
            borrowDate: this.#borrowDate,
            dueDate: dueDate ?? this.#dueDate,
            returnDate: this.#returnDate,
            status: status ?? this.#status
        })
    }

    // Serialization
    toJSON(){
        return {
            borrowId: this.#borrowId,
            bookId: this.#bookId,
            userId: this.#userId,
            borrowDate: this.#borrowDate,
            dueDate: this.#dueDate,
            returnDate: this.#returnDate,
            status: this.#status,
            isOverdue: this.isOverdue,
            daysOverdue: this.daysOverdue,
            isReturned: this.isReturned
        }
    }
}

module.exports = BorrowRecord;