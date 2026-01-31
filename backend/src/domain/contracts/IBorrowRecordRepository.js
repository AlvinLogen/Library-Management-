/**
 * IBorrowRecordRepository - Repository Pattern interface
 * Defines contract for borrow record persistance operations
 * 
 * Design by Contract: Each method defines its preconditions and postconditions
*/

class IBorrowRecordRepository {
    /**
     * Find borrow record by ID
     * @precondition: borrowId must be a positive integer
     * @postcondition: Returns BorrowRecord entity or null if not found
     */
    async findById(borrowId){
        throw new Error('Method not implemented');
    }

    /**
     * Find borrow records by criteria with pagination
     * @precondition: page >= 1, pageSize >= 1, pageSize <= 100
     * @postcondition: Returns array of BorrowRecord entities
     */
    async findbyCriteria({
        userId = null,
        bookId = null,
        status = null,
        page = 1,
        pageSize = 20
    }){
        throw new Error('Method not implemented');
    }

    /**
     * Find active (unreturned) borrow records for a user
     * @precondition: userId must be a positive integer
     * @postcondition: Returns array of BorrowRecord entities with status 'Borrowed'
     */
    async findActiveByUserId(userId){
        throw new Error('Method not implemented');
    }

    /**
     * Find overdue borrow records
     * @postcondition: Returns array of BorrowRecord entities where returnDate is null and dueDate < current date
     */
    async findOverdue() {
        throw new Error('Method not implemented');
    }

    /**
     * Save borrow record (create or update)
     * @precondition: borrowRecord must be valid BorrowRecord entity
     * @postcondition: Returns saved BorrowRecord entity with borrowId
     */
    async save(borrowRecord){
        throw new Error('Method not implemented');
    }

    /**
     * Get borrow statistics
     * @postcondition: Returns object with total borrows, active borrows, overdue count
     */
    async getStatistics(){
        throw new Error('Method not implemented');
    }   
}

module.exports = IBorrowRecordRepository;