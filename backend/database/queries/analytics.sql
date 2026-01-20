
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

-- GET the Category Hierarchy
