/**
 * GetBorrowStatistics Use Case
 * Retrieves library-wide borrow statistics
 * 
 * Design by Contract:
 * @precondition: None
 * @postcondition: Returns statistics object with counts and averages
 */
class GetBorrowStatistics {
    constructor(borrowRecordRepository) {
        this.borrowRecordRepository = borrowRecordRepository;
    }

    async execute() {
        // Call repository method (uses aggregate T-SQL: COUNT, SUM, AVG)
        const statistics = await this.borrowRecordRepository.getStatistics();

        // Postcondition: Return statistics object
        return statistics;
    }
}

module.exports = GetBorrowStatistics;