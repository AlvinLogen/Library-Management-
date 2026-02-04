const GetActiveBorrows = require('../../../../../src/application/usecases/borrow/GetActiveBorrows');

describe('GetActiveBorrows Use Case', () => {
    let getActiveBorrows;
    let mockBorrowRecordRepository;

    beforeEach(() => {
        mockBorrowRecordRepository = {
            findActiveByUserId: jest.fn()
        };

        getActiveBorrows = new GetActiveBorrows(mockBorrowRecordRepository);
    });

    describe('execute()', () => {
        test('should return active borrows for user', async () => {
            // Arrange
            const userId = 100;

            const mockActiveBorrows = [
                {
                    borrowId: 1,
                    bookId: 1,
                    bookTitle: 'Clean Code',
                    userId: 100,
                    borrowDate: new Date('2026-01-15'),
                    dueDate: new Date('2026-02-15'),
                    status: 'Borrowed',
                    toJSON: () => ({
                        borrowId: 1,
                        bookId: 1,
                        bookTitle: 'Clean Code',
                        userId: 100,
                        status: 'Borrowed'
                    })
                },
                {
                    borrowId: 2,
                    bookId: 2,
                    bookTitle: 'Refactoring',
                    userId: 100,
                    borrowDate: new Date('2026-01-20'),
                    dueDate: new Date('2026-02-20'),
                    status: 'Borrowed',
                    toJSON: () => ({
                        borrowId: 2,
                        bookId: 2,
                        bookTitle: 'Refactoring',
                        userId: 100,
                        status: 'Borrowed'
                    })
                }
            ];

            mockBorrowRecordRepository.findActiveByUserId.mockResolvedValue(mockActiveBorrows);

            // Act
            const result = await getActiveBorrows.execute(userId);

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].status).toBe('Borrowed');
            expect(result[1].status).toBe('Borrowed');
            expect(mockBorrowRecordRepository.findActiveByUserId).toHaveBeenCalledWith(userId);
        });

        test('should return empty array when user has no active borrows', async () => {
            // Arrange
            const userId = 100;
            mockBorrowRecordRepository.findActiveByUserId.mockResolvedValue([]);

            // Act
            const result = await getActiveBorrows.execute(userId);

            // Assert
            expect(result).toEqual([]);
        });

        test('should throw error when userId is invalid', async () => {
            // Arrange
            const invalidUserId = null;

            // Act & Assert
            await expect(getActiveBorrows.execute(invalidUserId)).rejects.toThrow();
        });

        test('should throw error when userId is not a positive number', async () => {
            // Arrange
            const invalidUserId = -1;

            // Act & Assert
            await expect(getActiveBorrows.execute(invalidUserId)).rejects.toThrow();
        });

        test('should verify active borrows have no return date', async () => {
            // Arrange
            const userId = 100;

            const activeBorrows = [
                {
                    borrowId: 1,
                    userId: 100,
                    status: 'Borrowed',
                    returnDate: null, // Key indicator of active borrow
                    toJSON: () => ({
                        borrowId: 1,
                        userId: 100,
                        status: 'Borrowed',
                        returnDate: null
                    })
                }
            ];

            mockBorrowRecordRepository.findActiveByUserId.mockResolvedValue(activeBorrows);

            // Act
            const result = await getActiveBorrows.execute(userId);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].returnDate).toBeNull();
        });

        test('should include book details in active borrows', async () => {
            // Arrange
            const userId = 100;

            const borrowsWithBookDetails = [
                {
                    borrowId: 1,
                    bookId: 1,
                    bookTitle: 'Effective Java',
                    bookIsbn: '978-0-134685991',
                    userId: 100,
                    status: 'Borrowed',
                    toJSON: () => ({
                        borrowId: 1,
                        bookId: 1,
                        bookTitle: 'Effective Java',
                        bookIsbn: '978-0-134685991',
                        userId: 100
                    })
                }
            ];

            mockBorrowRecordRepository.findActiveByUserId.mockResolvedValue(borrowsWithBookDetails);

            // Act
            const result = await getActiveBorrows.execute(userId);

            // Assert
            expect(result[0]).toHaveProperty('bookTitle');
            expect(result[0]).toHaveProperty('bookId');
        });

        test('should call repository with correct userId', async () => {
            // Arrange
            const userId = 100;
            mockBorrowRecordRepository.findActiveByUserId.mockResolvedValue([]);

            // Act
            await getActiveBorrows.execute(userId);

            // Assert
            expect(mockBorrowRecordRepository.findActiveByUserId).toHaveBeenCalledWith(userId);
            expect(mockBorrowRecordRepository.findActiveByUserId).toHaveBeenCalledTimes(1);
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const userId = 100;
            const dbError = new Error('Query failed');
            mockBorrowRecordRepository.findActiveByUserId.mockRejectedValue(dbError);

            // Act & Assert
            await expect(getActiveBorrows.execute(userId)).rejects.toThrow('Query failed');
        });

        test('should sort results by borrow date descending', async () => {
            // Arrange
            const userId = 100;

            const sortedBorrows = [
                {
                    borrowId: 2,
                    borrowDate: new Date('2026-02-01'),
                    toJSON: () => ({ borrowId: 2, borrowDate: new Date('2026-02-01') })
                },
                {
                    borrowId: 1,
                    borrowDate: new Date('2026-01-15'),
                    toJSON: () => ({ borrowId: 1, borrowDate: new Date('2026-01-15') })
                }
            ];

            mockBorrowRecordRepository.findActiveByUserId.mockResolvedValue(sortedBorrows);

            // Act
            const result = await getActiveBorrows.execute(userId);

            // Assert
            expect(result).toHaveLength(2);
            // Most recent borrows first (sorted in repository)
            expect(result[0].borrowDate >= result[1].borrowDate).toBeTruthy();
        });
    });
});
