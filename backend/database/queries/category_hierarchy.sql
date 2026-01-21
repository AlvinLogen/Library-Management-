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