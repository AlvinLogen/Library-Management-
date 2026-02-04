const BorrowBook = require('../../../../../src/application/usecases/borrow/BorrowBook');

describe('BorrowBook Use Case', () => {
    let borrowBook;
    let mockBookRepository;
    let mockBorrowRecordRepository;

    beforeEach(() => {
        mockBookRepository = {
            findById: jest.fn(),
            save: jest.fn()
        };

        mockBorrowRecordRepository = {
            save: jest.fn()
        };

        borrowBook = new BorrowBook(mockBookRepository, mockBorrowRecordRepository);
    });

    describe('execute()', () => {
        test('should borrow book when available', async () => {
            // Arrange
            const borrowData = {
                bookId: 1,
                userId: 100,
                dueDate: new Date('2026-03-01')
            };

            const mockBook = {
                bookId: 1,
                title: 'Clean Code',
                totalCopies: 5,
                availableCopies: 3,
                canBorrow: jest.fn().mockReturnValue(true),
                borrow: jest.fn().mockReturnValue({
                    bookId: 1,
                    availableCopies: 2
                })
            };

            const savedBorrowRecord = {
                borrowId: 1,
                bookId: 1,
                userId: 100,
                status: 'Borrowed',
                toJSON: () => ({
                    borrowId: 1,
                    bookId: 1,
                    userId: 100,
                    status: 'Borrowed'
                })
            };

            mockBookRepository.findById.mockResolvedValue(mockBook);
            mockBookRepository.save.mockResolvedValue(mockBook);
            mockBorrowRecordRepository.save.mockResolvedValue(savedBorrowRecord);

            // Act
            const result = await borrowBook.execute(borrowData);

            // Assert
            expect(result.borrowId).toBe(1);
            expect(mockBook.canBorrow).toHaveBeenCalled();
            expect(mockBook.borrow).toHaveBeenCalled();
            expect(mockBookRepository.save).toHaveBeenCalledWith({
                bookId: 1,
                availableCopies: 2
            });
            expect(mockBorrowRecordRepository.save).toHaveBeenCalled();
        });

        test('should throw error when book not found', async () => {
            // Arrange
            const borrowData = {
                bookId: 999,
                userId: 100,
                dueDate: new Date('2026-03-01')
            };

            mockBookRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(borrowBook.execute(borrowData)).rejects.toThrow();
        });

        test('should throw error when book not available', async () => {
            // Arrange
            const borrowData = {
                bookId: 1,
                userId: 100,
                dueDate: new Date('2026-03-01')
            };

            const mockBook = {
                bookId: 1,
                title: 'Clean Code',
                totalCopies: 5,
                availableCopies: 0,
                canBorrow: jest.fn().mockReturnValue(false),
                borrow: jest.fn()
            };

            mockBookRepository.findById.mockResolvedValue(mockBook);

            // Act & Assert
            await expect(borrowBook.execute(borrowData)).rejects.toThrow();
            expect(mockBook.borrow).not.toHaveBeenCalled();
        });

        test('should validate required fields', async () => {
            // Arrange
            const invalidData = {
                userId: 100
                // Missing bookId and dueDate
            };

            // Act & Assert
            await expect(borrowBook.execute(invalidData)).rejects.toThrow();
        });

        test('should coordinate book and borrow record updates', async () => {
            // Arrange
            const borrowData = {
                bookId: 1,
                userId: 100,
                dueDate: new Date('2026-03-01')
            };

            const mockBook = {
                bookId: 1,
                availableCopies: 3,
                canBorrow: jest.fn().mockReturnValue(true),
                borrow: jest.fn()
            };

            mockBookRepository.findById.mockResolvedValue(mockBook);
            mockBookRepository.save.mockResolvedValue(mockBook);
            mockBorrowRecordRepository.save.mockResolvedValue({ borrowId: 1, toJSON: () => ({}) });

            // Act
            await borrowBook.execute(borrowData);

            // Assert - Verify coordination of both repositories
            expect(mockBookRepository.findById).toHaveBeenCalled();
            expect(mockBook.borrow).toHaveBeenCalled();
            expect(mockBookRepository.save).toHaveBeenCalled();
            expect(mockBorrowRecordRepository.save).toHaveBeenCalled();

            // Verify order: book.borrow() before saving
            const borrowCallOrder = mockBook.borrow.mock.invocationCallOrder[0];
            const saveBookCallOrder = mockBookRepository.save.mock.invocationCallOrder[0];
            expect(borrowCallOrder).toBeLessThan(saveBookCallOrder);
        });

        test('should propagate errors from book repository', async () => {
            // Arrange
            const borrowData = {
                bookId: 1,
                userId: 100,
                dueDate: new Date('2026-03-01')
            };

            const dbError = new Error('Book update failed');
            mockBookRepository.findById.mockRejectedValue(dbError);

            // Act & Assert
            await expect(borrowBook.execute(borrowData)).rejects.toThrow('Book update failed');
        });

        test('should propagate errors from borrow record repository', async () => {
            // Arrange
            const borrowData = {
                bookId: 1,
                userId: 100,
                dueDate: new Date('2026-03-01')
            };

            const mockBook = {
                canBorrow: jest.fn().mockReturnValue(true),
                borrow: jest.fn()
            };

            const dbError = new Error('Borrow record creation failed');
            mockBookRepository.findById.mockResolvedValue(mockBook);
            mockBookRepository.save.mockResolvedValue(mockBook);
            mockBorrowRecordRepository.save.mockRejectedValue(dbError);

            // Act & Assert
            await expect(borrowBook.execute(borrowData)).rejects.toThrow('Borrow record creation failed');
        });
    });
});
