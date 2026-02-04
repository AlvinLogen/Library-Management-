const GetBook = require('../../../../../src/application/usecases/book/GetBook');

describe('GetBook Use Case', () => {
    let getBook;
    let mockBookRepository;

    beforeEach(() => {
        mockBookRepository = {
            findById: jest.fn()
        };

        getBook = new GetBook(mockBookRepository);
    });

    describe('execute()', () => {
        test('should return book when found', async () => {
            // Arrange
            const bookId = 1;
            const mockBook = {
                bookId: 1,
                isbn: '978-0-134685991',
                title: 'Effective Java',
                totalCopies: 5,
                availableCopies: 3,
                toJSON: () => ({
                    bookId: 1,
                    isbn: '978-0-134685991',
                    title: 'Effective Java',
                    totalCopies: 5,
                    availableCopies: 3
                })
            };
            mockBookRepository.findById.mockResolvedValue(mockBook);

            // Act
            const result = await getBook.execute(bookId);

            // Assert
            expect(result.bookId).toBe(1);
            expect(result.title).toBe('Effective Java');
            expect(mockBookRepository.findById).toHaveBeenCalledWith(bookId);
        });

        test('should return null when book not found', async () => {
            // Arrange
            const bookId = 999;
            mockBookRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(getBook.execute(bookId)).rejects.toThrow('Book with ID 999 not found');
        });

        test('should throw error when bookId is invalid', async () => {
            // Arrange
            const invalidId = null;

            // Act & Assert
            await expect(getBook.execute(invalidId)).rejects.toThrow();
        });
    });
});
