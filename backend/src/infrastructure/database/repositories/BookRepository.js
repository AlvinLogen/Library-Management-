const Book = require('../../../domain/entities/Book');
const IBookRepository = require('../../../domain/contracts/IBookRepository');

// BookRepository - SQL Server implementation
class BookRepository extends IBookRepository {
    constructor(dbConnection) {
        super();
        this.db = dbConnection;
    }

    async findbyId(bookId) {
        try {
            const query = `
                        SELECT
                        b.BookID = bookId, 
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
                    SELECT TOP 10,
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
