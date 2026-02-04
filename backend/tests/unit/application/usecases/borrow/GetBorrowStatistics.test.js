const GetBorrowStatistics = require('../../../../../src/application/usecases/borrow/GetBorrowStatistics');

describe('GetBorrowStatistics Use Case', () => {
    let getBorrowStatistics;
    let mockBorrowRecordRepository;

    beforeEach(() => {
        mockBorrowRecordRepository = {
            getStatistics: jest.fn()
        };

        getBorrowStatistics = new GetBorrowStatistics(mockBorrowRecordRepository);
    });

    describe('execute()', () => {
        test('should return borrow statistics', async () => {
            // Arrange
            const mockStatistics = {
                totalBorrows: 1250,
                activeBorrows: 45,
                overdueBooks: 12,
                averageBorrowDuration: 14.5,
                totalUsers: 150,
                mostBorrowedBooks: [
                    { bookId: 1, title: 'Clean Code', borrowCount: 50 },
                    { bookId: 2, title: 'Refactoring', borrowCount: 45 }
                ]
            };

            mockBorrowRecordRepository.getStatistics.mockResolvedValue(mockStatistics);

            // Act
            const result = await getBorrowStatistics.execute();

            // Assert
            expect(result.totalBorrows).toBe(1250);
            expect(result.activeBorrows).toBe(45);
            expect(result.overdueBooks).toBe(12);
            expect(result.averageBorrowDuration).toBe(14.5);
            expect(mockBorrowRecordRepository.getStatistics).toHaveBeenCalledTimes(1);
        });

        test('should verify statistics use aggregate functions', async () => {
            // Arrange - Mock data from aggregate T-SQL queries (COUNT, SUM, AVG)
            const aggregateStatistics = {
                totalBorrows: 500, // COUNT(*)
                activeBorrows: 25, // COUNT(*) WHERE status = 'Borrowed'
                overdueBooks: 5, // COUNT(*) WHERE status = 'Overdue'
                averageBorrowDuration: 12.8, // AVG(DATEDIFF(day, borrowDate, returnDate))
                totalLateFees: 145.50, // SUM(lateFee)
                totalUsers: 75 // COUNT(DISTINCT userId)
            };

            mockBorrowRecordRepository.getStatistics.mockResolvedValue(aggregateStatistics);

            // Act
            const result = await getBorrowStatistics.execute();

            // Assert
            expect(result).toHaveProperty('totalBorrows');
            expect(result).toHaveProperty('activeBorrows');
            expect(result).toHaveProperty('averageBorrowDuration');
            expect(typeof result.totalBorrows).toBe('number');
            expect(typeof result.averageBorrowDuration).toBe('number');
        });

        test('should handle empty statistics', async () => {
            // Arrange
            const emptyStatistics = {
                totalBorrows: 0,
                activeBorrows: 0,
                overdueBooks: 0,
                averageBorrowDuration: 0,
                totalUsers: 0
            };

            mockBorrowRecordRepository.getStatistics.mockResolvedValue(emptyStatistics);

            // Act
            const result = await getBorrowStatistics.execute();

            // Assert
            expect(result.totalBorrows).toBe(0);
            expect(result.activeBorrows).toBe(0);
        });

        test('should call repository getStatistics method', async () => {
            // Arrange
            const mockStats = {
                totalBorrows: 100,
                activeBorrows: 10,
                overdueBooks: 2
            };

            mockBorrowRecordRepository.getStatistics.mockResolvedValue(mockStats);

            // Act
            await getBorrowStatistics.execute();

            // Assert
            expect(mockBorrowRecordRepository.getStatistics).toHaveBeenCalled();
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const dbError = new Error('Statistics query failed');
            mockBorrowRecordRepository.getStatistics.mockRejectedValue(dbError);

            // Act & Assert
            await expect(getBorrowStatistics.execute()).rejects.toThrow('Statistics query failed');
        });

        test('should include most borrowed books in statistics', async () => {
            // Arrange
            const statisticsWithTopBooks = {
                totalBorrows: 1000,
                activeBorrows: 50,
                overdueBooks: 10,
                mostBorrowedBooks: [
                    { bookId: 1, title: 'Design Patterns', borrowCount: 75 },
                    { bookId: 2, title: 'Clean Architecture', borrowCount: 70 },
                    { bookId: 3, title: 'Domain-Driven Design', borrowCount: 65 }
                ]
            };

            mockBorrowRecordRepository.getStatistics.mockResolvedValue(statisticsWithTopBooks);

            // Act
            const result = await getBorrowStatistics.execute();

            // Assert
            expect(result.mostBorrowedBooks).toBeDefined();
            expect(result.mostBorrowedBooks).toHaveLength(3);
            expect(result.mostBorrowedBooks[0].borrowCount).toBeGreaterThanOrEqual(
                result.mostBorrowedBooks[1].borrowCount
            );
        });

        test('should calculate average borrow duration correctly', async () => {
            // Arrange
            const statisticsWithAverage = {
                totalBorrows: 100,
                activeBorrows: 10,
                overdueBooks: 2,
                averageBorrowDuration: 15.75, // AVG() result from T-SQL
                totalBorrowDays: 1575 // SUM() result
            };

            mockBorrowRecordRepository.getStatistics.mockResolvedValue(statisticsWithAverage);

            // Act
            const result = await getBorrowStatistics.execute();

            // Assert
            expect(result.averageBorrowDuration).toBe(15.75);
            // Verify calculation: totalBorrowDays / totalBorrows = 1575 / 100 = 15.75
            if (result.totalBorrowDays) {
                expect(result.averageBorrowDuration).toBeCloseTo(
                    result.totalBorrowDays / result.totalBorrows,
                    2
                );
            }
        });
    });
});
