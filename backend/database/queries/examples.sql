-- GET 10 Books by Cateory using Dense Rank
WITH RankedBooks AS (
    SELECT b.BookID, b.Title, c.CategoryName, 
           COUNT(bh.BorrowID) as BorrowCount,
           DENSE_RANK() OVER (PARTITION BY c.CategoryID ORDER BY COUNT(bh.BorrowID) DESC) as CategoryRank
    FROM Books b
    INNER JOIN BookCategories bc ON b.BookID = bc.BookID
    INNER JOIN Categories c ON bc.CategoryID = c.CategoryID
    LEFT JOIN BorrowHistory bh ON b.BookID = bh.BookID
    GROUP BY b.BookID, b.Title, c.CategoryName, c.CategoryID
)

SELECT *
FROM RankedBooks
WHERE CategoryRank <= 10
ORDER BY CategoryName, CategoryRank;

-- GET Monthly borrow trends with previous month comparison
WITH MonthlyBorrows AS (
    SELECT 
        YEAR(BorrowDate) as BorrowYear,
        MONTH(BorrowDate) as BorrowMonth,
        COUNT(*) AS BorrowCount
    FROM BorrowHistory
    GROUP BY YEAR(BorrowDate), MONTH(BorrowDate)
)
SELECT
    BorrowYear, 
    BorrowMonth, 
    BorrowCount,
    LAG(BorrowCount, 1, 0) OVER (ORDER BY BorrowYear, BorrowMonth) as PreviousMonthBorrows,
    BorrowCount - LAG(BorrowCount, 1, 0) OVER (ORDER BY BorrowYear, BorrowMonth) as MonthOverMonthChange,
    CAST(
        CASE 
            WHEN LAG(BorrowCount, 1, 0) OVER (ORDER BY BorrowYear, BorrowMonth) = 0 THEN 0
            ELSE ((BorrowCount - LAG(BorrowCount, 1, 0) OVER (ORDER BY BorrowYear, BorrowMonth)) * 100.0 / LAG(BorrowCount, 1,0) OVER (ORDER BY BorrowYear, BorrowMonth)) END AS DECIMAL(10,2)
    ) as PercentageChange
FROM MonthlyBorrows
ORDER BY BorrowYear, BorrowMonth;


-- GET Author rankings with running totals
SELECT 
    a.AuthorID,
    a.FirstName + ' ' + a.LastName as AuthorName,
    COUNT(DISTINCT b.BookID) as BooksWritten,
    COUNT(bh.BorrowID) as TotalBorrows,
    DENSE_RANK() OVER (ORDER BY COUNT(bh.BorrowID) DESC) as PopularityRank,
    SUM(COUNT(bh.BorrowID)) OVER (
        ORDER BY COUNT(bh.BorrowID) DESC 
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) as RunningTotalBorrows
FROM Authors a
INNER JOIN BookAuthors ba ON a.AuthorID = ba.AuthorID
INNER JOIN Books b ON ba.BookID = b.BookID
LEFT JOIN BorrowHistory bh ON b.BookID = bh.BookID
GROUP BY a.AuthorID, a.FirstName, a.LastName
ORDER BY PopularityRank;


SELECT
    b.BookID, 
    b.Title,
    b.ISBN,
    p.PublisherName,
    Authors.AuthorList,
    Categories.CategoryList
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
WHERE b.Title LIKE '%search_terms%'
  OR Authors.AuthorList LIKE '%search_term%';

-- Recursive CTE for category tree
WITH CategoryHierarchy AS (
    -- Anchor: Root categories
    SELECT
        CategoryID,
        CategoryName,
        ParentCategoryID,
        0 as Level, 
        CAST(CategoryName AS NVARCHAR(500)) as Path
    FROM Categories
    WHERE ParentCategoryID IS NULL

    UNION ALL

    -- Recursive: Child categories
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
    REPLICATE('  ', ch.Level) + ch.CategoryName as CategoryName,
    ch.Level,
    ch.Path,
    COUNT(bc.BookID) as BookCount
FROM CategoryHierarchy ch 
LEFT JOIN BookCategories bc ON ch.CategoryID = bc.CategoryID
GROUP BY ch.CategoryID, ch.CategoryName, ch.Level, ch.Path
ORDER BY ch.Path;