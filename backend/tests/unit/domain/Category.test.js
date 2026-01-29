const Category = require('../../../src/domain/entities/Category');

describe('Category Entity', () => {
    describe('Constructor and Invariants', () => {
        test('Should create category with valid data',() =>{
            const category = new Category({
                categoryId: 1,
                categoryName: 'Fiction',
                parentCategoryId: null,
                description: 'Fictional literature'
            });

            expect(category.categoryId).toBe(1);
            expect(category.categoryName).toBe('Fiction');
            expect(category.parentCategoryId).toBeNull();
            expect(category.description).toBe('Fictional literature');
            expect(category.isRootCategory).toBe(true);
        });

        test('Should enforce invariant: categoryName is required',() =>{
            expect(() => {
                new Category({
                    categoryName: ''
                });
            }).toThrow('Category name is required');
        });

        test('Should allow optional fields (catgoryId, parentCategoryId,description)',() =>{
            const category = new Category({
                categoryName: 'Science Fiction'
            });

            expect(category.categoryId).toBeNull();
            expect(category.parentCategoryId).toBeNull();
            expect(category.description).toBe('');
        });

        test('Should create child category with parentCategoryId',() =>{
            const childCategory = new Category({
                categoryId: 2,
                categoryName: 'Fantasy',
                parentCategoryId: 1,
                description: 'Fantasy subset of Fiction'
            });

            expect(childCategory.categoryId).toBe(2);
            expect(childCategory.isRootCategory).toBe(false);
        });
    });

    describe('isRootCategory Computed Property', () => {
        test('isRootCategory should return return true when no parent',() =>{
            const category = new Category({
                categoryName: 'Root Category'
            });

            expect(category.isRootCategory).toBe(true);
        });

        test('isRootCategory should return return false when has parent',() =>{
            const category = new Category({
                categoryName: 'Child Category',
                parentCategoryId: 10
            });

            expect(category.isRootCategory).toBe(false);
        });
    });

    describe('Immutable Update Pattern', () => {
        test('update() should return new Category instance',() =>{
            const original = new Category({
                categoryId: 1,
                categoryName: 'Original Name',
                description: 'Original description'
            });

            const updated = original.update({
                categoryName: 'Updated Name'
            });

            expect(original.categoryName).toBe('Original Name');
            expect(updated.categoryName).toBe('Updated Name');
            expect(updated.categoryId).toBe(1);
            expect(updated.description).toBe('Original description');
        });

        test('update() should handle null/undefined with nullish coalescing',() =>{
            const category = new Category({
                categoryName: 'Test Category',
                description: 'Original description'
            });

            const updated = category.update({
                description: undefined
            })

            expect(updated.description).toBe('Original description');
        });

        test('update() should allow changing parentCategoryId',() =>{
            const rootCategory = new Category({
                categoryName: 'Test',
                parentCategoryId: null
            });

            const childCategory = rootCategory.update({
                parentCategoryId: 5
            });

            expect(rootCategory.isRootCategory).toBe(true);
            expect(childCategory.isRootCategory).toBe(false);
            expect(childCategory.parentCategoryId).toBe(5);
        });
    });

    describe('toJSON Serialization', () => {
        test('toJSON() should return all properties including isRootCategory', () => {
            const category = new Category({
                categoryId: 1,
                categoryName: 'Fiction',
                parentCategoryId: null,
                description: 'Fictional works'
            });

            const json = category.toJSON();

            expect(json).toEqual({
                categoryId: 1,
                categoryName: 'Fiction',
                parentCategoryId: null,
                description: 'Fictional works',
                isRootCategory: true
            });
        });

        test('toJSON() should include isRootCategory as false for child categories', () => {
            const category = new Category({
                categoryId: 2,
                categoryName: 'Fantasy',
                parentCategoryId: 1,
                description: 'Fantasy books'
            });

            const json = category.toJSON();

            expect(json.isRootCategory).toBe(false);
            expect(json.parentCategoryId).toBe(1);
        });
    });
});