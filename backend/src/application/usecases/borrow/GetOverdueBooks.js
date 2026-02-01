/**
 * GetOverdueBooks Use Case
 * Retrieves all overdue borrow records
 * 
 * Design by Contract:
 * @precondition: None
 * @postcondition: Returns array of overdue BorrowRecord entities
 */
class GetOverdueBooks {
    constructor(borrowRecordRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
    }

    async execute() {
        // Call repository method (uses advanced T-SQL with DATEDIFF)
        const overdueRecords = await this.borrowRecordRepository.findOverdue();

        // Postcondition: Return array (can be empty)
        return overdueRecords;
    }
}

module.exports = GetOverdueBooks;