/**
 * IBookRepository - Repository pattern interface
 * Defines contract for book persistence operations
 */

class IBookRepository {
    // @precondition: bookID must be a positive integer
    async findbyId(bookId){
        throw new Error('Method not implemented');
    }

    // @precondition: page >= 1, pageSize >= 1, pageSize <= 100
    async findByCriteria({ searchTerm, categoryId, authorId, page, pageSize}){
        throw new Error('Method not implemented');
    }

    // @precondition: books be valid Book entity (object)
    async save(book){
        throw new Error('Method not implemented');
    }

    // get book analytics using t-sql
    async getAnalytics(){
        throw new Error('Method not implemented');
    }

    // get category hierarchy with book counts
    async getCategoryHierarchy() {
        throw new Error('Method not implemented');
    }
}

module.exports = IBookRepository;