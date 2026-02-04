const GetBookAnalytics = require('../../../../../src/application/usecases/book/GetBookAnalytics');

describe('GetBookAnalytics Use Case', () => {
    let getBookAnalytics;
    let mockBookRepository;

    beforeEach(() => {
        mockBookRepository = {
            getAnalytics: jest.fn()
        };

        getBookAnalytics = new GetBookAnalytics(mockBookRepository);
    });

    describe('execute()', () => {
        test('should return analytics data from repository', async () => {
            // Arrange
            const mockAnalytics = {
                BorrowTrends: JSON.stringify([
                    { year: 2026, month: 1, borrowCount: 150, previousMonth: 140, change: 10 },
                    { year: 2026, month: 2, borrowCount: 165, previousMonth: 150, change: 15 }
                ]),
                TopBooks: JSON.stringify([
                    { bookId: 1, title: 'Clean Code', totalBorrows: 50, rank: 1 },
                    { bookId: 2, title: 'Refactoring', totalBorrows: 45, rank: 2 }
                ])
            };

            mockBookRepository.getAnalytics.mockResolvedValue(mockAnalytics);

            // Act
            const result = await getBookAnalytics.execute();

            // Assert
            expect(result.borrowTrends).toHaveLength(2);
            expect(result.topBooks).toHaveLength(2);
            expect(mockBookRepository.getAnalytics).toHaveBeenCalledTimes(1);
        });

        test('should handle empty analytics', async () => {
            // Arrange
            const emptyAnalytics = {
                borrowTrends: [],
                topBooks: []
            };

            mockBookRepository.getAnalytics.mockResolvedValue(emptyAnalytics);

            // Act
            const result = await getBookAnalytics.execute();

            // Assert
            expect(result.borrowTrends).toHaveLength(0);
            expect(result.topBooks).toHaveLength(0);
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const dbError = new Error('Analytics query failed');
            mockBookRepository.getAnalytics.mockRejectedValue(dbError);

            // Act & Assert
            await expect(getBookAnalytics.execute()).rejects.toThrow('Analytics query failed');
        });

        test('should verify analytics contain window function calculations', async () => {
            // Arrange
            const analyticsWithWindowFunctions = {
                BorrowTrends: JSON.stringify([
                    { year: 2026, month: 1, borrowCount: 100, previousMonth: 0, change: 100 },
                    { year: 2026, month: 2, borrowCount: 120, previousMonth: 100, change: 20 }
                ]),
                TopBooks: JSON.stringify([
                    { bookId: 1, title: 'Book A', totalBorrows: 100, rank: 1 },
                    { bookId: 2, title: 'Book B', totalBorrows: 90, rank: 2 }
                ])
            };

            mockBookRepository.getAnalytics.mockResolvedValue(analyticsWithWindowFunctions);

            // Act
            const result = await getBookAnalytics.execute();

            // Assert - Verify window function structure
            expect(result.borrowTrends[0]).toHaveProperty('previousMonth');
            expect(result.borrowTrends[0]).toHaveProperty('change');
            expect(result.topBooks[0]).toHaveProperty('rank');
            
            // Verify LAG calculation logic
            if (result.borrowTrends.length > 1) {
                const secondMonth = result.borrowTrends[1];
                expect(secondMonth.change).toBe(secondMonth.borrowCount - secondMonth.previousMonth);
            }
        });
    });
});
