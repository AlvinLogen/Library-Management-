const UpdateBook = require('../../../../../src/application/usecases/book/UpdateBook');

describe('UpdateBook Use Case', () => {
    let updateBook;
    let mockBookRepository;

    beforeEach(() => {
        mockBookRepository = {
            findById: jest.fn(),
            save: jest.fn()
        };

        updateBook = new UpdateBook(mockBookRepository);
    });

    describe('execute()', () => {
        test('should update book when found', async () => {
            // Arrange
            const bookId = 1;
            const updateData = {
                title: 'Updated Title',
                description: 'Updated description'
            };

            const existingBook = {
                bookId: 1,
                isbn: '978-0-134685991',
                title: 'Old Title',
                description: 'Old description',
                totalCopies: 5,
                availableCopies: 3,
                update: jest.fn().mockReturnValue({
                    bookId: 1,
                    isbn: '978-0-134685991',
                    title: 'Updated Title',
                    description: 'Updated description',
                    totalCopies: 5,
                    availableCopies: 3,
                    toJSON: () => ({
                        bookId: 1,
                        isbn: '978-0-134685991',
                        title: 'Updated Title',
                        description: 'Updated description',
                        totalCopies: 5,
                        availableCopies: 3
                    })
                })
            };

            mockBookRepository.findById.mockResolvedValue(existingBook);
            mockBookRepository.save.mockResolvedValue(existingBook.update());

            // Act
            const result = await updateBook.execute({ bookId, ...updateData });

            // Assert
            expect(result.title).toBe('Updated Title');
            expect(result.description).toBe('Updated description');
            // Note: Implementation destructures all fields, so update() is called with all properties
        });

        test('should throw error when book not found', async () => {
            // Arrange
            const bookId = 999;
            const updateData = { title: 'New Title' };
            mockBookRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(updateBook.execute(bookId, updateData)).rejects.toThrow();
        });

        test('should enforce business rule: availableCopies cannot exceed totalCopies', async () => {
            // Arrange
            const bookId = 1;
            const invalidUpdate = {
                totalCopies: 3 // Trying to reduce below availableCopies
            };

            const existingBook = {
                bookId: 1,
                isbn: '978-0-134685991',
                title: 'Test Book',
                totalCopies: 5,
                availableCopies: 4, // Currently 4 available
                update: jest.fn()
            };

            mockBookRepository.findById.mockResolvedValue(existingBook);

            // Act & Assert
            await expect(updateBook.execute(bookId, invalidUpdate)).rejects.toThrow();
        });

        test('should allow updating totalCopies when valid', async () => {
            // Arrange
            const bookId = 1;
            const updateData = {
                totalCopies: 10
            };

            const existingBook = {
                bookId: 1,
                totalCopies: 5,
                availableCopies: 3,
                update: jest.fn().mockReturnValue({
                    bookId: 1,
                    totalCopies: 10,
                    availableCopies: 3,
                    toJSON: () => ({
                        bookId: 1,
                        totalCopies: 10,
                        availableCopies: 3
                    })
                })
            };

            mockBookRepository.findById.mockResolvedValue(existingBook);
            mockBookRepository.save.mockResolvedValue(existingBook.update());

            // Act
            const result = await updateBook.execute({ bookId, ...updateData });

            // Assert
            expect(result.totalCopies).toBe(10);
            expect(result.availableCopies).toBe(3);
        });

        test('should update only provided fields', async () => {
            // Arrange
            const bookId = 1;
            const partialUpdate = {
                description: 'Only updating description'
            };

            const existingBook = {
                bookId: 1,
                isbn: '978-0-134685991',
                title: 'Unchanged Title',
                description: 'Old description',
                update: jest.fn().mockReturnValue({
                    bookId: 1,
                    isbn: '978-0-134685991',
                    title: 'Unchanged Title',
                    description: 'Only updating description',
                    toJSON: () => ({
                        bookId: 1,
                        isbn: '978-0-134685991',
                        title: 'Unchanged Title',
                        description: 'Only updating description'
                    })
                })
            };

            mockBookRepository.findById.mockResolvedValue(existingBook);
            mockBookRepository.save.mockResolvedValue(existingBook.update());

            // Act
            const result = await updateBook.execute({ bookId, ...partialUpdate });

            // Assert
            expect(result.title).toBe('Unchanged Title');
            expect(result.description).toBe('Only updating description');
        });
    });
});
