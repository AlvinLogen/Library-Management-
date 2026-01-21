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
  OR Authors.AuthorList LIKE '%search_term%'