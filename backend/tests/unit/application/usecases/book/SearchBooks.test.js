const SearchBooks = require('../../../../../src/application/usecases/book/SearchBooks');

describe('SearchBooks Use Case', () => {
    let searchBooks;
    let mockBookRepository;

    beforeEach(() => {
        mockBookRepository = {
            findByCriteria: jest.fn(),
            countByCriteria: jest.fn()
        };

        searchBooks = new SearchBooks(mockBookRepository);
    });

    describe('execute()', () => {
        test('should return paginated search results', async () => {
            // Arrange
            const searchCriteria = {
                searchTerm: 'Java',
                page: 1,
                pageSize: 20
            };

            const mockBooks = [
                {
                    bookId: 1,
                    title: 'Effective Java',
                    toJSON: () => ({ bookId: 1, title: 'Effective Java' })
                },
                {
                    bookId: 2,
                    title: 'Java Concurrency',
                    toJSON: () => ({ bookId: 2, title: 'Java Concurrency' })
                }
            ];

            mockBookRepository.findByCriteria.mockResolvedValue(mockBooks);
            mockBookRepository.countByCriteria.mockResolvedValue(42);

            // Act
            const result = await searchBooks.execute(searchCriteria);

            // Assert
            expect(result).toHaveLength(2);
            expect(mockBookRepository.findByCriteria).toHaveBeenCalled(); // Math.ceil(42/20)
        });

        test('should validate page must be at least 1', async () => {
            // Arrange
            const invalidCriteria = {
                searchTerm: 'Java',
                page: 0,
                pageSize: 20
            };

            // Act & Assert
            await expect(searchBooks.execute(invalidCriteria)).rejects.toThrow('Page must be greater than 0');
        });

        test('should validate pageSize must be between 1 and 100', async () => {
            // Arrange
            const invalidCriteria = {
                searchTerm: 'Java',
                page: 1,
                pageSize: 150
            };

            // Act & Assert
            await expect(searchBooks.execute(invalidCriteria)).rejects.toThrow('Page size must be between 1 and 100');
        });

        test('should use default values when not provided', async () => {
            // Arrange
            mockBookRepository.findByCriteria.mockResolvedValue([]);
            mockBookRepository.countByCriteria.mockResolvedValue(0);

            // Act
            const result = await searchBooks.execute({});

            // Assert
            expect(mockBookRepository.findByCriteria).toHaveBeenCalledWith({
                searchTerm: '',
                categoryId: null,
                authorId: null,
                page: 1,
                pageSize: 20
            });
        });

        test('should search by category', async () => {
            // Arrange
            const criteria = {
                categoryId: 5,
                page: 1,
                pageSize: 10
            };

            mockBookRepository.findByCriteria.mockResolvedValue([]);
            mockBookRepository.countByCriteria.mockResolvedValue(0);

            // Act
            await searchBooks.execute(criteria);

            // Assert
            expect(mockBookRepository.findByCriteria).toHaveBeenCalledWith({
                searchTerm: '',
                categoryId: 5,
                authorId: null,
                page: 1,
                pageSize: 10
            });
        });

        test('should search by author', async () => {
            // Arrange
            const criteria = {
                authorId: 3,
                page: 1,
                pageSize: 10
            };

            mockBookRepository.findByCriteria.mockResolvedValue([]);
            mockBookRepository.countByCriteria.mockResolvedValue(0);

            // Act
            await searchBooks.execute(criteria);

            // Assert
            expect(mockBookRepository.findByCriteria).toHaveBeenCalledWith({
                searchTerm: '',
                categoryId: null,
                authorId: 3,
                page: 1,
                pageSize: 10
            });
        });
    });
});
