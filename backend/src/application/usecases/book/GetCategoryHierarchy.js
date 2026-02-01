/**
 * GetCategoryHierarchy Use Case
 * Retrieves hierarchical category structure with book counts
 * 
 * Design by Contract:
 * @precondition: None (returns full category tree)
 * @postcondition: Returns hierarchical category array
 */

class GetCategoryHierarchy {
    constructor(bookRepository){
        this.bookRepository = bookRepository;
    }

    async execute(){
        // Call repository method that uses recursive CTE
        const hierarchy = await this.bookRepository.getCategoryHierarchy();

        // Postcondition: Return category hierarchy (already parsed from JSON)
        return hierarchy;
    }
}

module.exports = GetCategoryHierarchy;