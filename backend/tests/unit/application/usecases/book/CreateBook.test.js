const CreateBook = require('../../../../../src/application/usecases/book/CreateBook');

describe('CreateBook Use Case', () => {
    let createBook;
    let mockBookRepository;

    beforeEach(() => {
        mockBookRepository = {
            save: jest.fn()
        };

        createBook = new CreateBook(mockBookRepository);
    });

    describe('execute()', () => {
        test('should create book with valid data', async () => {
            // Arrange
            const bookData = {
                isbn: '978-0-134685991',
                title: 'Effective Java',
                description: 'Best practices for Java',
                totalCopies: 5,
                publicationDate: new Date('2018-01-06')
            };

            const savedBook = {
                bookId: 1,
                ...bookData,
                availableCopies: 5,
                toJSON: () => ({
                    bookId: 1,
                    isbn: '978-0-134685991',
                    title: 'Effective Java',
                    description: 'Best practices for Java',
                    totalCopies: 5,
                    availableCopies: 5,
                    publicationDate: new Date('2018-01-06')
                })
            };

            mockBookRepository.save.mockResolvedValue(savedBook);

            // Act
            const result = await createBook.execute(bookData);

            // Assert
            expect(result.bookId).toBe(1);
            expect(result.title).toBe('Effective Java');
            expect(result.availableCopies).toBe(5);
            expect(mockBookRepository.save).toHaveBeenCalledTimes(1);
        });

        test('should initialize availableCopies equal to totalCopies', async () => {
            // Arrange
            const bookData = {
                isbn: '978-0-13468599',
                title: 'Test Book',
                totalCopies: 10
            };

            mockBookRepository.save.mockImplementation(book => {
                return {
                    ...book,
                    bookId: 1,
                    toJSON: () => ({ bookId: 1, ...book })
                };
            });

            // Act
            const result = await createBook.execute(bookData);

            // Assert
            const savedEntity = mockBookRepository.save.mock.calls[0][0];
            expect(savedEntity.availableCopies).toBe(10);
            expect(savedEntity.totalCopies).toBe(10);
        });

        test('should throw error when ISBN is missing', async () => {
            // Arrange
            const invalidData = {
                title: 'Test Book',
                totalCopies: 5
            };

            // Act & Assert
            await expect(createBook.execute(invalidData)).rejects.toThrow();
        });

        test('should throw error when title is missing', async () => {
            // Arrange
            const invalidData = {
                isbn: '978-0-134685991',
                totalCopies: 5
            };

            // Act & Assert
            await expect(createBook.execute(invalidData)).rejects.toThrow();
        });

        test('should create book with minimal data', async () => {
            // Arrange
            const minimalData = {
                isbn: '978-0-13468599',
                title: 'Minimal Book',
                totalCopies: 1
            };

            const savedBook = {
                bookId: 1,
                isbn: '978-0-13468599',
                title: 'Minimal Book',
                totalCopies: 1,
                availableCopies: 1,
                toJSON: () => ({
                    bookId: 1,
                    isbn: '978-0-13468599',
                    title: 'Minimal Book',
                    totalCopies: 1,
                    availableCopies: 1
                })
            };

            mockBookRepository.save.mockResolvedValue(savedBook);

            // Act
            const result = await createBook.execute(minimalData);

            // Assert
            expect(result.totalCopies).toBe(1);
            expect(result.availableCopies).toBe(1);
        });

        test('should handle date conversion from string', async () => {
            // Arrange
            const bookData = {
                isbn: '978-0-134685991',
                title: 'Test Book',
                publicationDate: '2018-01-06',
                totalCopies: 3
            };

            mockBookRepository.save.mockImplementation(book => ({
                ...book,
                bookId: 1,
                toJSON: () => ({ bookId: 1, ...book })
            }));

            // Act
            await createBook.execute(bookData);

            // Assert
            const savedEntity = mockBookRepository.save.mock.calls[0][0];
            expect(savedEntity.publicationDate).toBeInstanceOf(Date);
        });
    });
});
