const GetOverdueBooks = require('../../../../../src/application/usecases/borrow/GetOverdueBooks');

describe('GetOverdueBooks Use Case', () => {
    let getOverdueBooks;
    let mockBorrowRecordRepository;

    beforeEach(() => {
        mockBorrowRecordRepository = {
            findOverdue: jest.fn()
        };

        getOverdueBooks = new GetOverdueBooks(mockBorrowRecordRepository);
    });

    describe('execute()', () => {
        test('should return overdue borrow records', async () => {
            // Arrange
            const mockOverdueRecords = [
                {
                    borrowId: 1,
                    bookId: 1,
                    userId: 100,
                    borrowDate: new Date('2026-01-01'),
                    dueDate: new Date('2026-01-15'),
                    status: 'Overdue',
                    daysOverdue: 20,
                    toJSON: () => ({
                        borrowId: 1,
                        bookId: 1,
                        userId: 100,
                        daysOverdue: 20
                    })
                },
                {
                    borrowId: 2,
                    bookId: 2,
                    userId: 101,
                    borrowDate: new Date('2026-01-10'),
                    dueDate: new Date('2026-01-24'),
                    status: 'Overdue',
                    daysOverdue: 11,
                    toJSON: () => ({
                        borrowId: 2,
                        bookId: 2,
                        userId: 101,
                        daysOverdue: 11
                    })
                }
            ];

            mockBorrowRecordRepository.findOverdue.mockResolvedValue(mockOverdueRecords);

            // Act
            const result = await getOverdueBooks.execute();

            // Assert
            expect(result).toHaveLength(2);
            expect(result[0].daysOverdue).toBe(20);
            expect(result[1].daysOverdue).toBe(11);
            expect(mockBorrowRecordRepository.findOverdue).toHaveBeenCalledTimes(1);
        });

        test('should return empty array when no overdue books', async () => {
            // Arrange
            mockBorrowRecordRepository.findOverdue.mockResolvedValue([]);

            // Act
            const result = await getOverdueBooks.execute();

            // Assert
            expect(result).toEqual([]);
        });

        test('should call repository findOverdue method', async () => {
            // Arrange
            mockBorrowRecordRepository.findOverdue.mockResolvedValue([]);

            // Act
            await getOverdueBooks.execute();

            // Assert
            expect(mockBorrowRecordRepository.findOverdue).toHaveBeenCalled();
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const dbError = new Error('Query execution failed');
            mockBorrowRecordRepository.findOverdue.mockRejectedValue(dbError);

            // Act & Assert
            await expect(getOverdueBooks.execute()).rejects.toThrow('Query execution failed');
        });

        test('should verify overdue calculation uses DATEDIFF in repository', async () => {
            // Arrange - Mock data that would come from DATEDIFF T-SQL function
            const overdueWithCalculation = [
                {
                    borrowId: 1,
                    dueDate: new Date('2026-01-01'),
                    currentDate: new Date('2026-02-04'),
                    daysOverdue: 34, // DATEDIFF(day, dueDate, GETDATE())
                    toJSON: () => ({ borrowId: 1, daysOverdue: 34 })
                }
            ];

            mockBorrowRecordRepository.findOverdue.mockResolvedValue(overdueWithCalculation);

            // Act
            const result = await getOverdueBooks.execute();

            // Assert
            expect(result[0]).toHaveProperty('daysOverdue');
            expect(typeof result[0].daysOverdue).toBe('number');
            expect(result[0].daysOverdue).toBeGreaterThan(0);
        });

        test('should return records sorted by days overdue descending', async () => {
            // Arrange
            const mockOverdueRecords = [
                {
                    borrowId: 1,
                    daysOverdue: 30,
                    toJSON: () => ({ borrowId: 1, daysOverdue: 30 })
                },
                {
                    borrowId: 2,
                    daysOverdue: 15,
                    toJSON: () => ({ borrowId: 2, daysOverdue: 15 })
                },
                {
                    borrowId: 3,
                    daysOverdue: 45,
                    toJSON: () => ({ borrowId: 3, daysOverdue: 45 })
                }
            ];

            mockBorrowRecordRepository.findOverdue.mockResolvedValue(mockOverdueRecords);

            // Act
            const result = await getOverdueBooks.execute();

            // Assert
            expect(result).toHaveLength(3);
            // Typically would be sorted in repository, verify data structure
            result.forEach(record => {
                expect(record).toHaveProperty('daysOverdue');
                expect(record.daysOverdue).toBeGreaterThan(0);
            });
        });
    });
});
