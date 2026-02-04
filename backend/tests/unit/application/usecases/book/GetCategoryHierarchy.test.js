const GetCategoryHierarchy = require('../../../../../src/application/usecases/book/GetCategoryHierarchy');

describe('GetCategoryHierarchy Use Case', () => {
    let getCategoryHierarchy;
    let mockBookRepository;

    beforeEach(() => {
        mockBookRepository = {
            getCategoryHierarchy: jest.fn()
        };

        getCategoryHierarchy = new GetCategoryHierarchy(mockBookRepository);
    });

    describe('execute()', () => {
        test('should return hierarchical category structure', async () => {
            // Arrange
            const mockHierarchy = [
                {
                    categoryId: 1,
                    categoryName: 'Technology',
                    level: 0,
                    path: 'Technology',
                    bookCount: 50
                },
                {
                    categoryId: 2,
                    categoryName: 'Programming',
                    level: 1,
                    path: 'Technology > Programming',
                    bookCount: 30
                },
                {
                    categoryId: 3,
                    categoryName: 'JavaScript',
                    level: 2,
                    path: 'Technology > Programming > JavaScript',
                    bookCount: 15
                }
            ];

            mockBookRepository.getCategoryHierarchy.mockResolvedValue(mockHierarchy);

            // Act
            const result = await getCategoryHierarchy.execute();

            // Assert
            expect(result).toEqual(mockHierarchy);
            expect(mockBookRepository.getCategoryHierarchy).toHaveBeenCalledTimes(1);
        });

        test('should verify recursive CTE structure', async () => {
            // Arrange
            const hierarchyWithLevels = [
                { categoryId: 1, categoryName: 'Root', level: 0, path: 'Root', bookCount: 100 },
                { categoryId: 2, categoryName: 'Child', level: 1, path: 'Root > Child', bookCount: 50 },
                { categoryId: 3, categoryName: 'Grandchild', level: 2, path: 'Root > Child > Grandchild', bookCount: 20 }
            ];

            mockBookRepository.getCategoryHierarchy.mockResolvedValue(hierarchyWithLevels);

            // Act
            const result = await getCategoryHierarchy.execute();

            // Assert
            // Verify root level
            const rootCategories = result.filter(cat => cat.level === 0);
            expect(rootCategories.length).toBeGreaterThan(0);

            // Verify child levels have proper path structure
            const childCategories = result.filter(cat => cat.level > 0);
            childCategories.forEach(child => {
                expect(child.path).toContain('>');
                expect(child.level).toBeGreaterThan(0);
            });

            // Verify all have book counts
            result.forEach(category => {
                expect(category).toHaveProperty('bookCount');
                expect(typeof category.bookCount).toBe('number');
            });
        });

        test('should handle empty hierarchy', async () => {
            // Arrange
            mockBookRepository.getCategoryHierarchy.mockResolvedValue([]);

            // Act
            const result = await getCategoryHierarchy.execute();

            // Assert
            expect(result).toEqual([]);
        });

        test('should handle single-level hierarchy', async () => {
            // Arrange
            const flatHierarchy = [
                { categoryId: 1, categoryName: 'Category A', level: 0, path: 'Category A', bookCount: 10 },
                { categoryId: 2, categoryName: 'Category B', level: 0, path: 'Category B', bookCount: 15 }
            ];

            mockBookRepository.getCategoryHierarchy.mockResolvedValue(flatHierarchy);

            // Act
            const result = await getCategoryHierarchy.execute();

            // Assert
            expect(result).toHaveLength(2);
            expect(result.every(cat => cat.level === 0)).toBe(true);
        });

        test('should propagate repository errors', async () => {
            // Arrange
            const dbError = new Error('Recursive CTE query failed');
            mockBookRepository.getCategoryHierarchy.mockRejectedValue(dbError);

            // Act & Assert
            await expect(getCategoryHierarchy.execute()).rejects.toThrow('Recursive CTE query failed');
        });

        test('should verify categories include book count aggregation', async () => {
            // Arrange
            const hierarchyWithCounts = [
                { categoryId: 1, categoryName: 'Fiction', level: 0, path: 'Fiction', bookCount: 150 },
                { categoryId: 2, categoryName: 'Sci-Fi', level: 1, path: 'Fiction > Sci-Fi', bookCount: 75 },
                { categoryId: 3, categoryName: 'Fantasy', level: 1, path: 'Fiction > Fantasy', bookCount: 75 }
            ];

            mockBookRepository.getCategoryHierarchy.mockResolvedValue(hierarchyWithCounts);

            // Act
            const result = await getCategoryHierarchy.execute();

            // Assert
            result.forEach(category => {
                expect(category).toHaveProperty('bookCount');
                expect(category.bookCount).toBeGreaterThanOrEqual(0);
            });
        });
    });
});
