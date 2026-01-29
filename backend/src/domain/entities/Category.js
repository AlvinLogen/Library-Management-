/**
 * Category Entity - Domain Model
 * Represents a book category in the library system with hierarchical support
 * 
 * Design by Contract
 * - Invariants: categoryName required
 * - Supports parent-child relationships for category hierarchy
 * **/

class Category {
    #categoryId = null;
    #categoryName;
    #parentCategoryId;
    #description;

    constructor({
        categoryId = null,
        categoryName,
        parentCategoryId = null,
        description = ''
    }){
        this.#validateInvariants(categoryName);

        this.#categoryId = categoryId;
        this.#categoryName = categoryName;
        this.#parentCategoryId = parentCategoryId;
        this.#description = description;
    }

    #validateInvariants(categoryName){
        if(!categoryName || categoryName.trim().length === 0){
            throw new Error('Category name is required')
        }
    }

    get categoryId() { return this.#categoryId; }
    get categoryName() { return this.#categoryName; }
    get parentCategoryId() { return this.#parentCategoryId; }
    get isRootCategory() { return this.#parentCategoryId === null; }
    get description() { return this.#description; }

    update({ categoryName, parentCategoryId, description}){
        return new Category({
            categoryId: this.#categoryId,
            categoryName: categoryName ?? this.#categoryName,
            parentCategoryId: parentCategoryId ?? this.#parentCategoryId,
            description: description ?? this.#description
        });
    }

    toJSON(){
        return {
            categoryId: this.#categoryId,
            categoryName: this.#categoryName,
            parentCategoryId: this.#parentCategoryId,
            description: this.#description,
            isRootCategory: this.isRootCategory
        }
    }
}

module.exports = Category;