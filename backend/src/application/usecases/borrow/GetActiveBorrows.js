/**
 * GetActiveBorrows Use Case
 * Retrieves active (unreturned) borrows for a user
 * 
 * Design by Contract:
 * @precondition: userId must be valid
 * @postcondition: Returns array of active BorrowRecord entities
 */
class GetActiveBorrows {
    constructor(borrowRecordRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
    }

    async execute(userId) {
        // Precondition: Input validation
        if (!userId || userId <= 0) {
            throw new Error('Valid user ID is required');
        }

        // Call repository method (Status = 'Borrowed' AND ReturnDate IS NULL)
        const activeBorrows = await this.borrowRecordRepository.findActiveByUserId(userId);

        // Postcondition: Return array of active BorrowRecord entities
        return activeBorrows;
    }
}

module.exports = GetActiveBorrows;