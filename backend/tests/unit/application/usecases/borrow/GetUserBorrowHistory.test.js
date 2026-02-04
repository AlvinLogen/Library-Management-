const GetUserBorrowHistory = require('../../../../../src/application/usecases/borrow/GetUserBorrowHistory');

describe('GetUserBorrowHistory Use Case', () => {
    let getUserBorrowHistory;
    let mockBorrowRecordRepository;

    beforeEach(() => {
        mockBorrowRecordRepository = {
            findByCriteria: jest.fn(),
            countByCriteria: jest.fn()
        };

        getUserBorrowHistory = new GetUserBorrowHistory(mockBorrowRecordRepository);
    });

    describe('execute()', () => {
        test('should return user borrow history with pagination', async () => {
            // Arrange
            const userId = 100;
            const page = 1;
            const pageSize = 10;

            const mockBorrowRecords = [
                {
                    borrowId: 1,
                    bookId: 1,
                    userId: 100,
                    borrowDate: new Date('2026-01-01'),
                    returnDate: new Date('2026-01-15'),
                    status: 'Returned',
                    toJSON: () => ({
                        borrowId: 1,
                        bookId: 1,
                        userId: 100,
                        status: 'Returned'
                    })
                },
                {
                    borrowId: 2,
                    bookId: 2,
                    userId: 100,
                    borrowDate: new Date('2026-02-01'),
                    returnDate: null,
                    status: 'Borrowed',
                    toJSON: () => ({
                        borrowId: 2,
                        bookId: 2,
                        userId: 100,
                        status: 'Borrowed'
                    })
                }
            ];

            mockBorrowRecordRepository.findByCriteria.mockResolvedValue(mockBorrowRecords);
            mockBorrowRecordRepository.countByCriteria.mockResolvedValue(25);

            // Act
            const result = await getUserBorrowHistory.execute({ userId, page, pageSize });

            // Assert
            expect(result).toHaveLength(2);
            expect(mockBorrowRecordRepository.findByCriteria).toHaveBeenCalled();
            expect(mockBorrowRecordRepository.findByCriteria).toHaveBeenCalledWith({
                userId,
                status: null,
                page,
                pageSize
            });
        });

        test('should filter by status when provided', async () => {
            // Arrange
            const userId = 100;
            const status = 'Returned';
            const page = 1;
            const pageSize = 10;

            mockBorrowRecordRepository.findByCriteria.mockResolvedValue([]);
            mockBorrowRecordRepository.countByCriteria.mockResolvedValue(0);

            // Act
            await getUserBorrowHistory.execute({ userId, status, page, pageSize });

            // Assert
            expect(mockBorrowRecordRepository.findByCriteria).toHaveBeenCalledWith({
                userId,
                status: 'Returned',
                page,
                pageSize
            });
        });

        test('should validate page must be at least 1', async () => {
            // Arrange
            const invalidCriteria = {
                userId: 100,
                page: 0,
                pageSize: 10
            };

            // Act & Assert
            await expect(getUserBorrowHistory.execute(invalidCriteria)).rejects.toThrow('Page must be greater than 0');
        });

        test('should validate pageSize must be between 1 and 100', async () => {
            // Arrange
            const invalidCriteria = {
                userId: 100,
                page: 1,
                pageSize: 150
            };

            // Act & Assert
            await expect(getUserBorrowHistory.execute(invalidCriteria)).rejects.toThrow('Page size must be between 1 and 100');
        });

        test('should throw error when userId is missing', async () => {
            // Arrange
            const invalidCriteria = {
                page: 1,
                pageSize: 10
            };

            // Act & Assert
            await expect(getUserBorrowHistory.execute(invalidCriteria)).rejects.toThrow();
        });

        test('should use default pagination when not provided', async () => {
            // Arrange
            const userId = 100;

            mockBorrowRecordRepository.findByCriteria.mockResolvedValue([]);
            mockBorrowRecordRepository.countByCriteria.mockResolvedValue(0);

            // Act
            await getUserBorrowHistory.execute({ userId });

            // Assert
            expect(mockBorrowRecordRepository.findByCriteria).toHaveBeenCalledWith({
                userId,
                status: null,
                page: 1,
                pageSize: 20
            });
        });

        test('should return empty results when user has no history', async () => {
            // Arrange
            const userId = 100;

            mockBorrowRecordRepository.findByCriteria.mockResolvedValue([]);
            mockBorrowRecordRepository.countByCriteria.mockResolvedValue(0);

            // Act
            const result = await getUserBorrowHistory.execute({ userId, page: 1, pageSize: 10 });

            // Assert
            expect(result).toHaveLength(0);
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const userId = 100;
            const dbError = new Error('Database query failed');
            mockBorrowRecordRepository.findByCriteria.mockRejectedValue(dbError);

            // Act & Assert
            await expect(getUserBorrowHistory.execute({ userId, page: 1, pageSize: 10 })).rejects.toThrow('Database query failed');
        });
    });
});
