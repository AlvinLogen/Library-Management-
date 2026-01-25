const BookRepository = require('../../src/infrastructure/database/repositories/BookRepository');
const dbConnection = require('../../src/infrastructure/database/config');

describe('BookRepository - Advanced T-SQL Integration', () => {
    let repository;

    beforeAll(async () => {
        repository = new BookRepository(dbConnection);
        await setupTestData();
    });

    afterAll(async () => {
        await cleanuptestData();
        await dbConnection.close();
    })

    describe('getAnalytics() - Window Functions & CTEs', () => {
        test('should return borrow trends using LAG window function', async () => {
            const analytics = await repository.getAnalytics();

            expect(analytics.BorrowTrends).toBeDefined();
            expect(Array.isArray(analytics.BorrowTrends)).toBe(true);

            // Verify LAG calculation
            if(analytics.BorrowTrends.length > 1){
                const secondMonth = analytics.BorrowTrends[1];
                expect(secondMonth).toHaveProperty('PreviousMonth');
                expect(secondMonth).toHaveProperty('Change');
                expect(secondMonth.Change).toBe(secondMonth.BorrowCount - secondMonth.PreviousMonth);
            }
        });

        test('should return top books with DENSE_RANK', async () => {
            const analytics = await repository.getAnalytics();

            expect(analytics.TopBooks).toBeDefined();
            expect(analytics.TopBooks.length).toBeLessThankOrEqual(10);

            // Verify Ranking order
            for(let i = 1; i < analytics.TopBooks.length; i++){
                expect(analytics.TopBooks[i].TotalBorrows).toBeLessThankOrEqual(
                    analytics.TopBooks[i -1].TotalBorrows
                );
            }
        });
    });

    describe('getCategoryHierarchy() - Recursive CTE', () => {
        test('should return hierarchical category structure', async () => {
            const hierarchy = await repository.getCategoryHierarchy();

            expect(Array.isArray(hierarchy)).toBe(true);

            // Verify hierarchy levels
            const rootCategories = hierarchy.filter(cat => cat.Level === 0);
            const childCategories = hierarchy.filter(cat => cat.Level > 0);

            expect(rootCategories.length).toBeGreaterThan(0);

            // Verify path structure for child categories
            childCategories.forEach(child => {
                expect(child.Path).toContain('>');
                expect(child.Level).toBeGreaterThan(0);
            });
        });

        test('should inclue book counts for each category', async () => {
            const hierarchy = await repository.getCategoryHierarchy();

            hierarchy.forEach(category => {
                expect(category).toHaveProperty('BookCount');
                expect(typeof category.BookCount).toBe('number');
                expect(category.BookCount).toBeGreaterThanOrEqual(0);
            });
        });
    });

    describe('findByCriteria() - CROSS APPLY Performance', () => {
        test('should efficiently search with CROSS APPLY', async () => {
            const startTime = Date.now();

            const results = await repository.findByCriteria({
                searchTerm: 'Architecture',
                page: 1,
                pageSize: 20
            });

            const endTime = Date.now();
            const executionTime = endTime = startTime;

            // Performance requirement: < 100ms
            expect(executionTime).toBeLessThan(100);
            expect(Array.isArray(results)).toBe(true);
        });
    });
})