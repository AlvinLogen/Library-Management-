const ReturnBook = require('../../../../../src/application/usecases/borrow/ReturnBook');

describe('ReturnBook Use Case', () => {
    let returnBook;
    let mockBookRepository;
    let mockBorrowRecordRepository;

    beforeEach(() => {
        mockBookRepository = {
            findById: jest.fn(),
            save: jest.fn()
        };

        mockBorrowRecordRepository = {
            findById: jest.fn(),
            save: jest.fn()
        };

        returnBook = new ReturnBook(mockBookRepository, mockBorrowRecordRepository);
    });

    describe('execute()', () => {
        test('should return book successfully', async () => {
            // Arrange
            const returnData = {
                borrowId: 1
            };

            const mockBorrowRecord = {
                borrowId: 1,
                bookId: 1,
                userId: 100,
                borrowDate: new Date('2026-01-01'),
                dueDate: new Date('2026-02-01'),
                status: 'Borrowed',
                markAsReturned: jest.fn().mockReturnValue({
                    borrowId: 1,
                    status: 'Returned',
                    returnDate: new Date('2026-01-15')
                }),
                calculateLateFee: jest.fn().mockReturnValue(0)
            };

            const mockBook = {
                bookId: 1,
                totalCopies: 5,
                availableCopies: 2,
                returnCopy: jest.fn()
            };

            mockBorrowRecordRepository.findById.mockResolvedValue(mockBorrowRecord);
            mockBookRepository.findById.mockResolvedValue(mockBook);
            mockBookRepository.save.mockResolvedValue(mockBook);
            mockBorrowRecordRepository.save.mockResolvedValue(mockBorrowRecord.markAsReturned());

            // Act
            const result = await returnBook.execute(returnData);

            // Assert
            expect(result.borrowRecord).toBeDefined();
            expect(result.lateFee).toBe(0);
            expect(mockBorrowRecord.markAsReturned).toHaveBeenCalled();
            expect(mockBook.returnCopy).toHaveBeenCalled();
            expect(mockBookRepository.save).toHaveBeenCalled();
            expect(mockBorrowRecordRepository.save).toHaveBeenCalled();
        });

        test('should calculate late fee when overdue', async () => {
            // Arrange
            const returnData = {
                borrowId: 1
            };

            const mockBorrowRecord = {
                borrowId: 1,
                bookId: 1,
                dueDate: new Date('2026-01-01'),
                isOverdue: true,
                markAsReturned: jest.fn().mockReturnValue({
                    borrowId: 1,
                    status: 'Returned',
                    returnDate: new Date('2026-01-15'),
                    isOverdue: true,
                    calculateLateFee: jest.fn().mockReturnValue(14.00)
                }),
                calculateLateFee: jest.fn().mockReturnValue(14.00)
            };

            const mockBook = {
                bookId: 1,
                returnCopy: jest.fn()
            };

            mockBorrowRecordRepository.findById.mockResolvedValue(mockBorrowRecord);
            mockBookRepository.findById.mockResolvedValue(mockBook);
            mockBookRepository.save.mockResolvedValue(mockBook);
            mockBorrowRecordRepository.save.mockResolvedValue(mockBorrowRecord.markAsReturned());

            // Act
            const result = await returnBook.execute(returnData);

            // Assert
            const returnedRecord = result.borrowRecord;
            expect(returnedRecord.calculateLateFee).toHaveBeenCalled();
            expect(result.lateFee).toBeGreaterThan(0);
        });

        test('should throw error when borrow record not found', async () => {
            // Arrange
            const borrowId = 999;
            mockBorrowRecordRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(returnBook.execute(borrowId)).rejects.toThrow();
        });

        test('should throw error when book not found', async () => {
            // Arrange
            const borrowId = 1;

            const mockBorrowRecord = {
                borrowId: 1,
                bookId: 999
            };

            mockBorrowRecordRepository.findById.mockResolvedValue(mockBorrowRecord);
            mockBookRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(returnBook.execute(borrowId)).rejects.toThrow();
        });

        test('should throw error when book already returned', async () => {
            // Arrange
            const borrowId = 1;

            const mockBorrowRecord = {
                borrowId: 1,
                bookId: 1,
                status: 'Returned', // Already returned
                returnDate: new Date('2026-01-10')
            };

            mockBorrowRecordRepository.findById.mockResolvedValue(mockBorrowRecord);

            // Act & Assert
            await expect(returnBook.execute(borrowId)).rejects.toThrow();
        });

        test('should coordinate book and borrow record updates', async () => {
            // Arrange
            const returnData = {
                borrowId: 1
            };

            const mockBorrowRecord = {
                borrowId: 1,
                bookId: 1,
                status: 'Borrowed',
                markAsReturned: jest.fn().mockReturnValue({ status: 'Returned' }),
                calculateLateFee: jest.fn().mockReturnValue(0)
            };

            const mockBook = {
                bookId: 1,
                returnCopy: jest.fn()
            };

            mockBorrowRecordRepository.findById.mockResolvedValue(mockBorrowRecord);
            mockBookRepository.findById.mockResolvedValue(mockBook);
            mockBookRepository.save.mockResolvedValue(mockBook);
            mockBorrowRecordRepository.save.mockResolvedValue(mockBorrowRecord.markAsReturned());

            // Act
            await returnBook.execute(returnData);

            // Assert - Verify coordination
            expect(mockBorrowRecordRepository.findById).toHaveBeenCalled();
            expect(mockBookRepository.findById).toHaveBeenCalled();
            expect(mockBook.returnCopy).toHaveBeenCalled();
            expect(mockBorrowRecord.markAsReturned).toHaveBeenCalled();
            expect(mockBookRepository.save).toHaveBeenCalled();
            expect(mockBorrowRecordRepository.save).toHaveBeenCalled();
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const returnData = {
                borrowId: 1
            };
            const dbError = new Error('Database transaction failed');
            mockBorrowRecordRepository.findById.mockRejectedValue(dbError);

            // Act & Assert
            await expect(returnBook.execute(returnData)).rejects.toThrow('Database transaction failed');
        });
    });
});
