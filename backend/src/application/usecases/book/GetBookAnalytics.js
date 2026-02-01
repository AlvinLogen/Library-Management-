/**
 * GetBookAnalytics Use Case
 * Retrieves book analytics including borrow trends and top books
 * 
 * Design by Contract:
 * @precondition: None (returns analytics for all books)
 * @postcondition: Returns analytics object with borrow trends and top books
 */

class GetBookAnalytics {
    constructor(bookRepository){
        this.bookRepository = bookRepository;
    }

    async execute(){
        // Call repository analytics method: Advanced T-SQL 
        const analytics = await this.bookRepository.getAnalytics();

        // Parse JSON results from SQL Server
        const parsedAnalytics = {
            borrowTrends: analytics.BorrowTrends ? JSON.parse(analytics.BorrowTrends) : [],
            topBooks: analytics.TopBooks ? JSON.parse(analytics.TopBooks) : []
        };

        return parsedAnalytics;
    }
}

module.exports = GetBookAnalytics;