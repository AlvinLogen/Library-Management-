/**
 * GetUserBorrowHistory Use Case
 * Retrieves borrow history for a specific user
 * 
 * Design by Contract:
 * @precondition: userId must be valid
 * @postcondition: Returns array of BorrowRecord entities for user
 */
class GetUserBorrowHistory {
    constructor(borrowRecordRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
    }

    async execute({ userId, status = null, page = 1, pageSize = 20 }) {
        // Precondition: Input validation
        if (!userId || userId <= 0) {
            throw new Error('Valid user ID is required');
        }

        if (page < 1) {
            throw new Error('Page must be greater than 0');
        }

        if (pageSize < 1 || pageSize > 100) {
            throw new Error('Page size must be between 1 and 100');
        }

        // Call repository with filters
        const borrowRecords = await this.borrowRecordRepository.findByCriteria({
            userId,
            status,
            page,
            pageSize
        });

        // Postcondition: Return array of BorrowRecord entities
        return borrowRecords;
    }
}

module.exports = GetUserBorrowHistory;