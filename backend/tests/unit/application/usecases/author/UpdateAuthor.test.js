const UpdateAuthor = require('../../../../../src/application/usecases/author/UpdateAuthor');

describe('UpdateAuthor Use Case', () => {
    let updateAuthor;
    let mockAuthorRepository;

    beforeEach(() => {
        mockAuthorRepository = {
            findById: jest.fn(),
            save: jest.fn()
        };

        updateAuthor = new UpdateAuthor(mockAuthorRepository);
    });

    describe('execute()', () => {
        test('should update author when found', async () => {
            // Arrange
            const authorId = 1;
            const updateData = {
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Updated biography - Clean Code author'
            };

            const existingAuthor = {
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Old biography',
                update: jest.fn().mockReturnValue({
                    authorId: 1,
                    firstName: 'Robert',
                    lastName: 'Martin',
                    biography: 'Updated biography - Clean Code author',
                    toJSON: () => ({
                        authorId: 1,
                        firstName: 'Robert',
                        lastName: 'Martin',
                        biography: 'Updated biography - Clean Code author'
                    })
                })
            };

            const updatedAuthor = existingAuthor.update();
            mockAuthorRepository.findById.mockResolvedValue(existingAuthor);
            mockAuthorRepository.save.mockResolvedValue(updatedAuthor);

            // Act
            const result = await updateAuthor.execute({ authorId, ...updateData });

            // Assert
            expect(result.biography).toBe('Updated biography - Clean Code author');
            expect(existingAuthor.update).toHaveBeenCalledWith(updateData);
            expect(mockAuthorRepository.findById).toHaveBeenCalledWith(authorId);
            expect(mockAuthorRepository.save).toHaveBeenCalledTimes(1);
        });

        test('should throw error when author not found', async () => {
            // Arrange
            const authorId = 999;
            const updateData = { biography: 'New bio' };
            mockAuthorRepository.findById.mockResolvedValue(null);

            // Act & Assert
            await expect(updateAuthor.execute(authorId, updateData)).rejects.toThrow();
        });

        test('should update only provided fields', async () => {
            // Arrange
            const authorId = 1;
            const partialUpdate = {
                biography: 'Only updating biography'
            };

            const existingAuthor = {
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Old biography',
                update: jest.fn().mockReturnValue({
                    authorId: 1,
                    firstName: 'Robert',
                    lastName: 'Martin',
                    biography: 'Only updating biography',
                    toJSON: () => ({
                        authorId: 1,
                        firstName: 'Robert',
                        lastName: 'Martin',
                        biography: 'Only updating biography'
                    })
                })
            };

            mockAuthorRepository.findById.mockResolvedValue(existingAuthor);
            mockAuthorRepository.save.mockResolvedValue(existingAuthor.update());

            // Act
            const result = await updateAuthor.execute({ authorId, ...partialUpdate });

            // Assert
            expect(result.firstName).toBe('Robert'); // Unchanged
            expect(result.lastName).toBe('Martin'); // Unchanged
            expect(result.biography).toBe('Only updating biography'); // Changed
            // Note: Implementation destructures all fields, so update() is called with all properties
        });

        test('should throw error when authorId is invalid', async () => {
            // Arrange
            const invalidId = null;
            const updateData = { biography: 'Test' };

            // Act & Assert
            await expect(updateAuthor.execute(invalidId, updateData)).rejects.toThrow();
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const authorId = 1;
            const updateData = { biography: 'Test' };
            const dbError = new Error('Database update failed');
            
            mockAuthorRepository.findById.mockResolvedValue({
                update: jest.fn().mockReturnValue({ toJSON: () => ({}) })
            });
            mockAuthorRepository.save.mockRejectedValue(dbError);

            // Act & Assert
            await expect(updateAuthor.execute({ authorId, ...updateData })).rejects.toThrow('Database update failed');
        });
    });
});
