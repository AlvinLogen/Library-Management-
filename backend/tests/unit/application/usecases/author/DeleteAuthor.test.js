const DeleteAuthor = require('../../../../../src/application/usecases/author/DeleteAuthor');

describe('DeleteAuthor Use Case', () => {
    let deleteAuthor;
    let mockAuthorRepository;

    beforeEach(() => {
        mockAuthorRepository = {
            findById: jest.fn(),
            deleteById: jest.fn()
        };

        deleteAuthor = new DeleteAuthor(mockAuthorRepository);
    });

    describe('execute()', () => {
        test('should delete author when found', async () => {
            // Arrange
            const authorId = 1;
            const existingAuthor = {
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin'
            };

            mockAuthorRepository.findById.mockResolvedValue(existingAuthor);
            mockAuthorRepository.deleteById.mockResolvedValue(true);

            // Act
            const result = await deleteAuthor.execute(authorId);

            // Assert
            expect(result).toBe(true);
            expect(mockAuthorRepository.findById).toHaveBeenCalledWith(authorId);
            expect(mockAuthorRepository.deleteById).toHaveBeenCalledWith(authorId);
            expect(mockAuthorRepository.deleteById).toHaveBeenCalledTimes(1);
        });

        test('should throw error when author not found', async () => {
            // Arrange
            const authorId = 999;
            mockAuthorRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(deleteAuthor.execute(authorId)).rejects.toThrow();
            expect(mockAuthorRepository.deleteById).not.toHaveBeenCalled();
        });

        test('should throw error when authorId is invalid', async () => {
            // Arrange
            const invalidId = null;

            // Act & Assert
            await expect(deleteAuthor.execute(invalidId)).rejects.toThrow();
        });

        test('should throw error when authorId is not a positive number', async () => {
            // Arrange
            const invalidId = -1;

            // Act & Assert
            await expect(deleteAuthor.execute(invalidId)).rejects.toThrow();
        });

        test('should propagate repository errors during lookup', async () => {
            // Arrange
            const authorId = 1;
            const dbError = new Error('Database connection failed');
            mockAuthorRepository.findById.mockRejectedValue(dbError);

            // Act & Assert
            await expect(deleteAuthor.execute(authorId)).rejects.toThrow('Database connection failed');
        });

        test('should propagate repository errors during deletion', async () => {
            // Arrange
            const authorId = 1;
            const existingAuthor = { authorId: 1, firstName: 'Test', lastName: 'Author' };
            const dbError = new Error('Foreign key constraint violation');
            
            mockAuthorRepository.findById.mockResolvedValue(existingAuthor);
            mockAuthorRepository.deleteById.mockRejectedValue(dbError);

            // Act & Assert
            await expect(deleteAuthor.execute(authorId)).rejects.toThrow('Foreign key constraint violation');
        });
    });
});
