const Book = require('../../../domain/entities/Book');
const IBookRepository = require('../../../domain/contracts/IBookRepository');

// BookRepository - SQL Server implementation
class BookRepository extends IBookRepository {
    constructor(dbConnection) {
        super();
        this.db = dbConnection;
    }

    async findById(bookId) {
        try {
            const query = `
                        SELECT
                        b.BookID as bookId, 
                        b.ISBN as isbn,
                        b.Title as title,
                        b.TotalCopies as totalCopies,
                        b.AvailableCopies as availableCopies,
                        b.PublicationDate as publicationDate,
                        b.Description as description,
                        p.PublisherName as publisherName,
                        Authors.AuthorList as authors,
                        Categories.CategoryList as categories
                    FROM Books b
                    LEFT JOIN Publishers p ON b.PublisherID = p.PublisherID
                    CROSS APPLY(
                        SELECT STRING_AGG(a.FirstName + ' ' + a.LastName, ', ') as AuthorList
                        FROM BookAuthors ba
                        INNER JOIN Authors a ON ba.AuthorID = a.AuthorID
                        WHERE ba.BookID = b.BookID
                    ) Authors
                    CROSS APPLY (
                        SELECT STRING_AGG(c.CategoryName, ', ') as CategoryList
                        FROM BookCategories bc
                        INNER JOIN Categories c ON bc.CategoryID = c.CategoryID
                        WHERE bc.BookID = b.BookID
                    ) Categories
                    WHERE b.BookID = @bookId;
                    `;

            const result = await this.db.query(query, { bookId });

            if (result.recordset.length === 0) return null;

            const row = result.recordset[0];
            return new Book({
                bookId: row.bookId,
                isbn: row.isbn,
                title: row.title,
                totalCopies: row.totalCopies,
                availableCopies: row.availableCopies,
                publicationDate: row.publicationDate,
                description: row.description
            });
        } catch (error) {
            throw new Error(`Failed to find book by ID: ${error.message}`);
        }
    }

    async findByCriteria({ searchTerm = '', categoryId = null, authorId = null, page = 1, pageSize = 20 }) {
        try {
            const offset = (page - 1) * pageSize;
            const searchPattern = `%${searchTerm}%`;
            const query = `
                SELECT
                    b.BookID as bookId,
                    b.ISBN as isbn,
                    b.Title as title,
                    b.TotalCopies as totalCopies,
                    b.AvailableCopies as availableCopies,
                    b.PublicationDate as publicationDate,
                    b.Description as description,
                    p.PublisherName as publisherName,
                    Authors.AuthorList as authors,
                    Categories.CategoryList as categories
                FROM Books b
                LEFT JOIN Publishers p ON b.PublisherID = p.PublisherID
                CROSS APPLY (
                    SELECT STRING_AGG(a.FirstName + ' ' + a.LastName, ', ') as AuthorList
                    FROM BookAuthors ba
                    INNER JOIN Authors a ON ba.AuthorID = a.AuthorID
                    WHERE ba.BookID = b.BookID
                    ) Authors
                CROSS APPLY (
                    SELECT STRING_AGG(c.CategoryName, ', ') as CategoryList
                    FROM BookCategories bc
                    INNER JOIN Categories c ON bc.CategoryID = c.CategoryID
                    WHERE bc.BookID = b.BookID
                    ) Categories
                WHERE
                    (@searchTerm = '' OR b.Title LIKE @searchPattern OR
                     b.Description LIKE @searchPattern)
                AND (@categoryId IS NULL OR EXISTS(
                    SELECT 1 FROM BookCategories bc2
                    WHERE bc2.BookID = b.BookID AND bc2.CategoryID = @categoryId
                ))
                AND (@authorId IS NULL OR EXISTS(
                    SELECT 1 FROM BookAuthors ba2
                    WHERE ba2.BookID = b.BookID AND ba2.AuthorID = @authorId
                ))
                ORDER BY b.Title
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY;
            `;

            const result = await this.db.query(query, {
                searchTerm, searchPattern, categoryId, authorId, offset, pageSize
            });

            return result.recordset.map(row => new Book({
                bookId: row.bookId,
                isbn: row.isbn,
                title: row.title,
                totalCopies: row.totalCopies,
                availableCopies: row.availableCopies,
                publicationDate: row.publicationDate,
                description: row.description
            }));

        } catch (error) {
            throw new Error(`Failed to find books by search criteria: ${error.message}`)
        }
    }

    async save(book) {
        if (!(book instanceof Book)) {
            throw new Error('Invalid book entity');
        }

        try {
            // If bookId exists, UPDATE; else INSERT
            if (book.bookId) {
                const query = `
                UPDATE Books
                SET
                    ISBN = @isbn,
                    Title = @title,
                    TotalCopies = @totalCopies,
                    AvailableCopies = @availableCopies,
                    PublicationDate = @publicationDate,
                    Description = @description
                WHERE BookID = @bookId;

                SELECT
                    b.BookID as bookId,
                    b.ISBN as isbn,
                    b.Title as title,
                    b.TotalCopies as totalCopies,
                    b.AvailableCopies as availableCopies,
                    b.PublicationDate as publicationDate,
                    b.Description as description
                FROM Books b
                WHERE BookID = @bookId;
            `;

                const result = await this.db.query(query, {
                    bookId: book.bookId,
                    isbn: book.isbn,
                    title: book.title,
                    totalCopies: book.totalCopies,
                    availableCopies: book.availableCopies,
                    publicationDate: book.publicationDate,
                    description: book.description
                });

                const row = result.recordset[0];
                return new Book({
                    bookId: row.bookId,
                    isbn: row.isbn,
                    title: row.title,
                    totalCopies: row.totalCopies,
                    availableCopies: row.availableCopies,
                    publicationDate: row.publicationDate,
                    description: row.description
                });

            } else {
                const query = `
                INSERT INTO Books (ISBN, Title, TotalCopies, AvailableCopies, PublicationDate, Description)
                OUTPUT
                    INSERTED.BookID as bookId,
                    INSERTED.ISBN as isbn,
                    INSERTED.Title as title,
                    INSERTED.TotalCopies as totalCopies,
                    INSERTED.AvailableCopies as availableCopies,
                    INSERTED.PublicationDate as publicationDate,
                    INSERTED.Description as description
                VALUES (@isbn, @title, @totalCopies, @availableCopies, @publicationDate, @description);
            `;

                const result = await this.db.query(query, {
                    isbn: book.isbn,
                    title: book.title,
                    totalCopies: book.totalCopies,
                    availableCopies: book.availableCopies,
                    publicationDate: book.publicationDate,
                    description: book.description
                });

                const row = result.recordset[0];
                return new Book({
                    bookId: row.bookId,
                    isbn: row.isbn,
                    title: row.title,
                    totalCopies: row.totalCopies,
                    availableCopies: row.availableCopies,
                    publicationDate: row.publicationDate,
                    description: row.description
                });
            }
        } catch (error) {
            throw new Error(`Failed to save book: ${error.message}`);
        }
    }

    async deleteById(bookId) {
        try {
            const query = `
                DELETE FROM Books
                WHERE BookID = @bookId;

                SELECT @@ROWCOUNT as rowsAffected;
            `;

            const result = await this.db.query(query, {bookId});

            if (result.recordset[0].rowsAffected === 0 ){
                throw new Error(`Book with ID ${bookId} not found`);
            }

            return true;
            
        } catch (error) {
            throw new Error(`Failed to delete book: ${error.message}`);
        }
    }

    async getAnalytics() {
        try {
            const query = `
                WITH MonthlyBorrows AS (
                    SELECT 
                        YEAR(BorrowDate) as Year,
                        MONTH(BorrowDate) as Month,
                        COUNT(*) AS Count
                    FROM BorrowHistory
                    GROUP BY YEAR(BorrowDate), MONTH(BorrowDate)
                ),
                BorrowTrends AS (
                    SELECT
                        Year, 
                        Month, 
                        BorrowCount,
                        LAG(BorrowCount, 1, 0) OVER (ORDER BY Year, Month) as PreviousMonth,
                        BorrowCount - LAG(BorrowCount, 1, 0) OVER (ORDER BY Year, Month) as Change
                    FROM MonthlyBorrows            
                )
                TopBooks AS (
                    SELECT TOP 10
                        b.BookID,
                        b.Title,
                        COUNT(bh.BorrowID) as TotalBorrows,
                        DENSE_RANK() OVER (ORDER BY COUNT(bh.BorrowID) DESC) as Rank
                    FROM Books b
                    LEFT JOIN BorrowHistory bh ON b.BookID = bh.BookID
                    GROUP BY b.BookID, b.Title
                    ORDER BY TotalBorrows DESC
                )
                SELECT
                (SELECT * FROM BorrowTrends FOR JSON PATH) as BorrowTrends,
                (SELECT * FROM TopBooks FOR JSON PATH) as TopBooks;
            `;

            const result = await this.db.query(query);
            return result.recordset[0];
        } catch (error) {
            throw new Error(`Unable to retrieve Monthly Borrow Trends: ${error.message}`);
        }

    }

    async getCategoryHierarchy() {
        try {
            const query = `
                WITH CategoryHierarchy AS (
                    SELECT
                        CategoryID,
                        CategoryName,
                        ParentCategoryID,
                        0 as Level, 
                        CAST(CategoryName AS NVARCHAR(500)) as Path
                    FROM Categories
                    WHERE ParentCategoryID IS NULL
                    UNION ALL
                    SELECT
                        c.CategoryID, 
                        c.CategoryName, 
                        c.ParentCategoryID,
                        ch.Level + 1,
                        CAST(ch.Path + ' > ' + c.CategoryName AS NVARCHAR(500))
                    FROM Categories c
                    INNER JOIN CategoryHierarchy ch ON c.ParentCategoryID = ch.CategoryID
                )
                SELECT
                    ch.CategoryID,
                    ch.CategoryName,
                    ch.Level,
                    ch.Path,
                    COUNT(bc.BookID) as BookCount
                FROM CategoryHierarchy ch 
                LEFT JOIN BookCategories bc ON ch.CategoryID = bc.CategoryID
                GROUP BY ch.CategoryID, ch.CategoryName, ch.Level, ch.Path
                ORDER BY ch.Path
                FOR JSON PATH;
            `;

            const result = await this.db.query(query);
            return JSON.parse(result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']);

        } catch (error) {
            throw new Error(`Failed to retrieve category hierarchy: ${error.message}`);
        }
    }
}

module.exports = BookRepository;
