const CreateAuthor = require('../../../../../src/application/usecases/author/CreateAuthor');

describe('CreateAuthor Use Case', () => {
    let createAuthor;
    let mockAuthorRepository;

    beforeEach(() => {
        mockAuthorRepository = {
            save: jest.fn()
        };

        createAuthor = new CreateAuthor(mockAuthorRepository);
    });

    describe('execute()', () => {
        test('should create author with valid data', async () => {
            // Arrange
            const authorData = {
                firstName: 'Martin',
                lastName: 'Fowler',
                biography: 'Software architect',
                birthDate: new Date('1963-01-01'),
                country: 'USA'
            };

            const savedAuthor = {
                authorId: 1,
                ...authorData,
                toJSON: () => ({
                    authorId: 1,
                    firstName: 'Martin',
                    lastName: 'Fowler',
                    biography: 'Software architect',
                    birthDate: new Date('1963-01-01'),
                    country: 'USA'
                })
            };

            mockAuthorRepository.save.mockResolvedValue(savedAuthor);

            // Act
            const result = await createAuthor.execute(authorData);

            // Assert
            expect(result.toJSON()).toEqual({
                authorId: 1,
                firstName: 'Martin',
                lastName: 'Fowler',
                biography: 'Software architect',
                birthDate: new Date('1963-01-01'),
                country: 'USA'
            });
            expect(mockAuthorRepository.save).toHaveBeenCalledTimes(1);
            // Verify save was called with an Author entity
            const savedEntity = mockAuthorRepository.save.mock.calls[0][0];
            expect(savedEntity).toHaveProperty('firstName');
            expect(savedEntity.firstName).toBe('Martin');
        });

        test('should throw error when firstName is missing', async () => {
            // Arrange
            const invalidData = {
                lastName: 'Fowler',
                biography: 'Software architect'
            };

            // Act & Assert
            await expect(createAuthor.execute(invalidData)).rejects.toThrow();
        });

        test('should throw error when lastName is missing', async () => {
            // Arrange
            const invalidData = {
                firstName: 'Martin',
                biography: 'Software architect'
            };

            // Act & Assert
            await expect(createAuthor.execute(invalidData)).rejects.toThrow();
        });

        test('should create author with minimal data (only required fields)', async () => {
            // Arrange
            const minimalData = {
                firstName: 'Jane',
                lastName: 'Doe',
                birthDate: new Date('1980-01-01')
            };

            const savedAuthor = {
                authorId: 2,
                firstName: 'Jane',
                lastName: 'Doe',
                biography: '',
                birthDate: null,
                country: '',
                toJSON: () => ({
                    authorId: 2,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    biography: '',
                    birthDate: null,
                    country: ''
                })
            };

            mockAuthorRepository.save.mockResolvedValue(savedAuthor);

            // Act
            const result = await createAuthor.execute(minimalData);

            // Assert
            expect(result.authorId).toBe(2);
            expect(result.firstName).toBe('Jane');
            expect(result.lastName).toBe('Doe');
            expect(mockAuthorRepository.save).toHaveBeenCalledTimes(1);
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const authorData = {
                firstName: 'Test',
                lastName: 'Author',
                birthDate: new Date('1980-01-01')
            };
            const dbError = new Error('Database constraint violation');
            mockAuthorRepository.save.mockRejectedValue(dbError);

            // Act & Assert
            await expect(createAuthor.execute(authorData)).rejects.toThrow('Database constraint violation');
        });
    });
});
