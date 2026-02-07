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

    async execute(userId = null) {
        // Precondition: Input validation
        if (userId !== null && userId <= 0) {
            throw new Error('Valid user ID must be greater than 0');
        }

        if (userId) {
            const activeBorrows = await this.borrowRecordRepository.findActiveByUserId(userId);
            return activeBorrows;
        } else {
            // Get All Active Borrows
            const activeBorrows = await this.borrowRecordRepository.findAllActive();
            return activeBorrows;
        }

    }
}

module.exports = GetActiveBorrows;