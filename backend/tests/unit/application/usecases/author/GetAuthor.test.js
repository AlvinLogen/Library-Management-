const GetAuthor = require('../../../../../src/application/usecases/author/GetAuthor');

describe('GetAuthor Use Case', () => {
    let getAuthor;
    let mockAuthorRepository;

    beforeEach(() => {
        // Create mock repository
        mockAuthorRepository = {
            findById: jest.fn()
        };

        // Create use case with mocked dependency
        getAuthor = new GetAuthor(mockAuthorRepository);
    });

    describe('execute()', () => {
        test('should return author when found', async () => {
            // Arrange
            const authorId = 1;
            const mockAuthor = {
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Author of Clean Code',
                toJSON: () => ({
                    authorId: 1,
                    firstName: 'Robert',
                    lastName: 'Martin',
                    biography: 'Author of Clean Code'
                })
            };
            mockAuthorRepository.findById.mockResolvedValue(mockAuthor);

            // Act
            const result = await getAuthor.execute(authorId);

            // Assert
            expect(result.toJSON()).toEqual({
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Author of Clean Code'
            });
            expect(mockAuthorRepository.findById).toHaveBeenCalledWith(authorId);
            expect(mockAuthorRepository.findById).toHaveBeenCalledTimes(1);
        });

        test('should return null when author not found', async () => {
            // Arrange
            const authorId = 999;
            mockAuthorRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(getAuthor.execute(authorId)).rejects.toThrow('Author with ID 999 not found');
            expect(mockAuthorRepository.findById).toHaveBeenCalledWith(authorId);
        });

        test('should throw error when authorId is invalid', async () => {
            // Arrange
            const invalidId = null;

            // Act & Assert
            await expect(getAuthor.execute(invalidId)).rejects.toThrow();
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const authorId = 1;
            const dbError = new Error('Database connection failed');
            mockAuthorRepository.findById.mockRejectedValue(dbError);

            // Act & Assert
            await expect(getAuthor.execute(authorId)).rejects.toThrow('Database connection failed');
        });
    });
});
