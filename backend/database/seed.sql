USE BookLibrary;
GO

DELETE FROM BorrowHistory;
DELETE FROM BookCategories;
DELETE FROM BookAuthors;
DELETE FROM Books;
DELETE FROM Categories;
DELETE FROM Authors;
DELETE FROM Publishers;
DELETE FROM Users;
GO

SET IDENTITY_INSERT Publishers ON;

INSERT INTO Publishers (PublisherID, PublisherName, Country, Website) VALUES
(1, 'Penguin Random House', 'United States', 'https://www.penguinrandomhouse.com'),
(2, 'HarperCollins', 'United States', 'https://www.harpercollins.com'),
(3, 'Simon & Schuster', 'United States', 'https://www.simonandschuster.com'),
(4, 'Hachette Book Group', 'United States', 'https://www.hachettebookgroup.com'),
(5, 'Macmillan Publishers', 'United Kingdom', 'https://www.macmillan.com'),
(6, 'Oxford University Press', 'United Kingdom', 'https://global.oup.com'),
(7, 'Cambridge University Press', 'United Kingdom', 'https://www.cambridge.org'),
(8, 'Springer', 'Germany', 'https://www.springer.com'),
(9, 'O''Reilly Media', 'United States', 'https://www.oreilly.com'),
(10, 'Pearson', 'United Kingdom', 'https://www.pearson.com');

SET IDENTITY_INSERT Publishers OFF;
GO

SET IDENTITY_INSERT Authors ON;

INSERT INTO Authors (AuthorID, FirstName, LastName, Biography, BirthDate, Country) VALUES
(1, 'George', 'Orwell', 'English novelist and essayist, journalist and critic.', '1903-06-25', 'United Kingdom'),
(2, 'J.K.', 'Rowling', 'British author, best known for Harry Potter series.', '1965-07-31', 'United Kingdom'),
(3, 'Stephen', 'King', 'American author of horror, supernatural fiction, suspense.', '1947-09-21', 'United States'),
(4, 'Agatha', 'Christie', 'English writer known for detective novels.', '1890-09-15', 'United Kingdom'),
(5, 'Isaac', 'Asimov', 'American writer and professor of biochemistry, prolific sci-fi author.', '1920-01-02', 'United States'),
(6, 'J.R.R.', 'Tolkien', 'English writer, poet, and philologist, author of The Lord of the Rings.', '1892-01-03', 'United Kingdom'),
(7, 'Harper', 'Lee', 'American novelist known for To Kill a Mockingbird.', '1926-04-28', 'United States'),
(8, 'Robert', 'Martin', 'American software engineer and author, known as Uncle Bob.', '1952-12-05', 'United States'),
(9, 'Martin', 'Fowler', 'British software developer, author and international speaker.', '1963-12-18', 'United Kingdom'),
(10, 'Eric', 'Evans', 'Software engineer and author of Domain-Driven Design.', '1960-05-15', 'United States'),
(11, 'Andrew', 'Hunt', 'Co-author of The Pragmatic Programmer.', '1964-08-20', 'United States'),
(12, 'David', 'Thomas', 'Co-author of The Pragmatic Programmer.', '1956-03-10', 'United Kingdom'),
(13, 'Donald', 'Knuth', 'American computer scientist, mathematician, and professor emeritus.', '1938-01-10', 'United States'),
(14, 'Brian', 'Kernighan', 'Canadian computer scientist, co-author of The C Programming Language.', '1942-01-01', 'Canada'),
(15, 'Dennis', 'Ritchie', 'American computer scientist, creator of C language.', '1941-09-09', 'United States'),
(16, 'Carl', 'Sagan', 'American astronomer, cosmologist, astrophysicist, and author.', '1934-11-09', 'United States'),
(17, 'Stephen', 'Hawking', 'English theoretical physicist, cosmologist, and author.', '1942-01-08', 'United Kingdom'),
(18, 'Richard', 'Feynman', 'American theoretical physicist, known for quantum mechanics.', '1918-05-11', 'United States'),
(19, 'Neil deGrasse', 'Tyson', 'American astrophysicist, author, and science communicator.', '1958-10-05', 'United States'),
(20, 'Michio', 'Kaku', 'American theoretical physicist and futurist.', '1947-01-24', 'United States');

SET IDENTITY_INSERT Authors OFF;
GO

SET IDENTITY_INSERT Categories ON;

INSERT INTO Categories (CategoryID, CategoryName, ParentCategoryID, Description) VALUES
(1, 'Fiction', NULL, 'Literary works of imaginative narration'),
(2, 'Non-Fiction', NULL, 'Factual and informative works'),
(3, 'Technology', NULL, 'Computing, programming, and IT'),
(4, 'Science', NULL, 'Natural sciences and mathematics'),
(10, 'Science Fiction', 1, 'Speculative fiction based on science'),
(11, 'Fantasy', 1, 'Magical and mythical narratives'),
(12, 'Mystery', 1, 'Detective and crime fiction'),
(13, 'Horror', 1, 'Scary and suspenseful narratives'),
(14, 'Classic Literature', 1, 'Timeless literary works'),
(20, 'Space Opera', 10, 'Large-scale space adventures'),
(21, 'Cyberpunk', 10, 'High tech, low life scenarios'),
(22, 'Epic Fantasy', 11, 'Grand scale fantasy worlds'),
(23, 'Urban Fantasy', 11, 'Fantasy set in modern cities'),
(24, 'Detective Fiction', 12, 'Professional detective stories'),
(25, 'Cozy Mystery', 12, 'Amateur detective, gentle mysteries'),
(30, 'Biography', 2, 'Life stories of real people'),
(31, 'History', 2, 'Historical events and periods'),
(32, 'Philosophy', 2, 'Philosophical thought and theory'),
(33, 'Self-Help', 2, 'Personal development and improvement'),
(34, 'Business', 2, 'Business and management topics'),
(40, 'Programming', 3, 'Software development and coding'),
(41, 'Database', 3, 'Database design and management'),
(42, 'Web Development', 3, 'Web technologies and frameworks'),
(43, 'Software Architecture', 3, 'System design and architecture'),
(44, 'DevOps', 3, 'Development operations and practices'),
(50, 'JavaScript', 40, 'JavaScript programming'),
(51, 'Python', 40, 'Python programming'),
(52, 'C/C++', 40, 'C and C++ programming'),
(53, 'SQL', 41, 'SQL and relational databases'),
(54, 'NoSQL', 41, 'Non-relational databases'),
(55, 'Frontend', 42, 'Client-side web development'),
(56, 'Backend', 42, 'Server-side web development'),
(60, 'Physics', 4, 'Physical sciences'),
(61, 'Astronomy', 4, 'Space and celestial objects'),
(62, 'Biology', 4, 'Life sciences'),
(63, 'Mathematics', 4, 'Mathematical theory and application'),
(64, 'Chemistry', 4, 'Chemical sciences'),
(70, 'Quantum Physics', 60, 'Quantum mechanics and theory'),
(71, 'Astrophysics', 61, 'Physics of celestial objects'),
(72, 'Cosmology', 61, 'Origin and evolution of universe');

SET IDENTITY_INSERT Categories OFF;
GO

SET IDENTITY_INSERT Users ON;

INSERT INTO Users (UserID, UserName, Email, FullName, MembershipDate, IsActive) VALUES
(1, 'johndoe', 'john.doe@email.com', 'John Doe', '2024-01-15', 1),
(2, 'janesmith', 'jane.smith@email.com', 'Jane Smith', '2024-02-20', 1),
(3, 'bobwilson', 'bob.wilson@email.com', 'Bob Wilson', '2024-03-10', 1),
(4, 'alicejones', 'alice.jones@email.com', 'Alice Jones', '2024-04-05', 1),
(5, 'charliebrown', 'charlie.brown@email.com', 'Charlie Brown', '2024-05-12', 1),
(6, 'dianamiller', 'diana.miller@email.com', 'Diana Miller', '2024-06-08', 1),
(7, 'evanmoore', 'evan.moore@email.com', 'Evan Moore', '2024-07-22', 1),
(8, 'franktaylor', 'frank.taylor@email.com', 'Frank Taylor', '2024-08-14', 1),
(9, 'graceanderson', 'grace.anderson@email.com', 'Grace Anderson', '2024-09-01', 1),
(10, 'henrythomas', 'henry.thomas@email.com', 'Henry Thomas', '2024-10-18', 1),
(11, 'ivyjackson', 'ivy.jackson@email.com', 'Ivy Jackson', '2025-01-05', 1),
(12, 'jackwhite', 'jack.white@email.com', 'Jack White', '2025-02-14', 1),
(13, 'karenharris', 'karen.harris@email.com', 'Karen Harris', '2025-03-20', 0),
(14, 'liammartin', 'liam.martin@email.com', 'Liam Martin', '2025-04-25', 1),
(15, 'monicagarcia', 'monica.garcia@email.com', 'Monica Garcia', '2025-05-30', 1);

SET IDENTITY_INSERT Users OFF;
GO

SET IDENTITY_INSERT Books ON;

INSERT INTO Books (BookID, ISBN, Title, PublicationDate, PublisherID, TotalCopies, AvailableCopies, Description) VALUES
(1, '9780451524935', '1984', '1949-06-08', 1, 5, 3, 'Dystopian social science fiction novel and cautionary tale.'),
(2, '9780439708180', 'Harry Potter and the Sorcerer''s Stone', '1997-06-26', 2, 8, 5, 'First novel in the Harry Potter series.'),
(3, '9780439136365', 'Harry Potter and the Prisoner of Azkaban', '1999-07-08', 2, 6, 4, 'Third novel in the Harry Potter series.'),
(4, '9780307588371', 'The Stand', '1978-10-03', 3, 4, 2, 'Post-apocalyptic dark fantasy novel.'),
(5, '9780062073488', 'Murder on the Orient Express', '1934-01-01', 4, 5, 5, 'Detective novel featuring Hercule Poirot.'),
(6, '9780553293357', 'Foundation', '1951-06-01', 5, 6, 3, 'First novel in the Foundation series.'),
(7, '9780547928227', 'The Hobbit', '1937-09-21', 2, 7, 4, 'Fantasy novel and prelude to The Lord of the Rings.'),
(8, '9780547928210', 'The Fellowship of the Ring', '1954-07-29', 2, 5, 2, 'First volume of The Lord of the Rings.'),
(9, '9780061120084', 'To Kill a Mockingbird', '1960-07-11', 4, 6, 4, 'Novel about racial injustice in American South.'),
(10, '9780385333849', 'The Shining', '1977-01-28', 3, 4, 1, 'Horror novel about haunted hotel.'),
(11, '9780132350884', 'Clean Code', '2008-08-01', 9, 10, 6, 'A Handbook of Agile Software Craftsmanship by Robert Martin.'),
(12, '9780134494166', 'Clean Architecture', '2017-09-20', 9, 8, 5, 'A Craftsman''s Guide to Software Structure and Design.'),
(13, '9780201633610', 'Design Patterns', '1994-10-31', 10, 7, 4, 'Elements of Reusable Object-Oriented Software.'),
(14, '9780135957059', 'The Pragmatic Programmer', '1999-10-30', 10, 9, 7, 'Your Journey to Mastery, 20th Anniversary Edition.'),
(15, '9780321125215', 'Domain-Driven Design', '2003-08-20', 10, 6, 3, 'Tackling Complexity in the Heart of Software.'),
(16, '9780136291558', 'Object-Oriented Analysis and Design', '2004-10-26', 10, 5, 3, 'With Applications, Third Edition.'),
(17, '9780134685991', 'Effective Java', '2017-12-27', 10, 7, 5, 'Third Edition by Joshua Bloch.'),
(18, '9780596517748', 'JavaScript: The Good Parts', '2008-05-01', 9, 8, 6, 'Unearthing the Excellence in JavaScript.'),
(19, '9780596806750', 'HTML5: Up and Running', '2010-08-01', 9, 6, 4, 'Dive into the Future of Web Development.'),
(20, '9780596007126', 'Head First Design Patterns', '2004-10-01', 9, 9, 7, 'Building Extensible and Maintainable Object-Oriented Software.'),
(21, '9781617294549', 'SQL Queries for Mere Mortals', '2018-04-01', 10, 6, 4, 'A Hands-On Guide to Data Manipulation.'),
(22, '9781484255995', 'Beginning T-SQL', '2020-03-15', 8, 8, 5, 'A Step-by-Step Approach, Fourth Edition.'),
(23, '9780596516185', 'SQL Cookbook', '2005-12-01', 9, 5, 3, 'Query Solutions and Techniques for All SQL Users.'),
(24, '9780321884497', 'Database Design for Mere Mortals', '2013-02-01', 10, 7, 5, 'A Hands-On Guide to Relational Database Design.'),
(25, '9781449374006', 'MongoDB: The Definitive Guide', '2013-05-01', 9, 5, 2, 'Powerful and Scalable Data Storage.'),
(26, '9780345539434', 'Cosmos', '1980-01-01', 1, 7, 4, 'Journey through space and time by Carl Sagan.'),
(27, '9780553380163', 'A Brief History of Time', '1988-04-01', 5, 8, 5, 'From the Big Bang to Black Holes.'),
(28, '9780393355635', 'Astrophysics for People in a Hurry', '2017-05-02', 6, 9, 7, 'Quick guide to the universe by Neil deGrasse Tyson.'),
(29, '9780465025275', 'Surely You''re Joking, Mr. Feynman!', '1985-01-01', 6, 6, 4, 'Adventures of a Curious Character.'),
(30, '9780307947468', 'The Grand Design', '2010-09-07', 1, 5, 3, 'New Answers to the Ultimate Questions of Life.'),
(31, '9780201616224', 'The Pragmatic Programmer: First Edition', '1999-10-30', 10, 4, 2, 'From Journeyman to Master - Classic Edition.'),
(32, '9780321146533', 'Test Driven Development', '2002-11-08', 10, 6, 4, 'By Example, Kent Beck.'),
(33, '9780134494173', 'The Clean Coder', '2011-05-23', 9, 7, 5, 'A Code of Conduct for Professional Programmers.'),
(34, '9780201485677', 'Refactoring', '1999-07-08', 10, 6, 3, 'Improving the Design of Existing Code.'),
(35, '9780321193681', 'Agile Software Development', '2002-10-25', 10, 5, 3, 'Principles, Patterns, and Practices.'),
(36, '9781593279509', 'Eloquent JavaScript', '2018-12-04', 9, 8, 6, 'A Modern Introduction to Programming, 3rd Edition.'),
(37, '9781491952023', 'JavaScript: The Definitive Guide', '2020-05-20', 9, 7, 4, 'Master the World''s Most-Used Programming Language, 7th Edition.'),
(38, '9781492051367', 'Learning Web Design', '2018-06-01', 9, 6, 4, 'A Beginner''s Guide to HTML, CSS, JavaScript.'),
(39, '9781491918661', 'You Don''t Know JS', '2015-07-01', 9, 9, 7, 'Up & Going, Kyle Simpson.'),
(40, '9781449365035', 'Speaking JavaScript', '2014-02-01', 9, 5, 3, 'An In-Depth Guide for Programmers.');

SET IDENTITY_INSERT Books OFF;
GO

INSERT INTO BookAuthors (BookID, AuthorID, DisplayOrder) VALUES
(1, 1, 1),    -- 1984 by George Orwell
(2, 2, 1),    -- HP Sorcerer's Stone by J.K. Rowling
(3, 2, 1),    -- HP Prisoner of Azkaban by J.K. Rowling
(4, 3, 1),    -- The Stand by Stephen King
(5, 4, 1),    -- Murder on Orient Express by Agatha Christie
(6, 5, 1),    -- Foundation by Isaac Asimov
(7, 6, 1),    -- The Hobbit by Tolkien
(8, 6, 1),
(9, 7, 1),
(10, 3, 1),
(11, 8, 1),
(12, 8, 1),
(13, 9, 1),
(14, 11, 1),
(14, 12, 2),
(15, 10, 1),
(17, 8, 1),
(18, 14, 1),
(19, 14, 1),
(20, 9, 1),
(21, 10, 1),
(22, 10, 1),
(23, 14, 1),
(24, 10, 1),
(25, 13, 1),
(26, 16, 1),
(27, 17, 1),
(28, 19, 1),
(29, 18, 1),
(30, 17, 1),
(30, 20, 2),
(31, 11, 1),
(31, 12, 2),
(32, 8, 1),
(33, 8, 1),
(34, 9, 1),
(35, 8, 1),
(36, 14, 1),
(37, 14, 1),
(38, 14, 1),
(39, 14, 1),
(40, 14, 1);
GO

INSERT INTO BookCategories (BookID, CategoryID) VALUES
(1, 1), (1, 14),
(2, 1), (2, 11), (2, 22),
(3, 1), (3, 11), (3, 22),
(4, 1), (4, 13), (4, 10),
(5, 1), (5, 12), (5, 24),
(6, 1), (6, 10), (6, 20),
(7, 1), (7, 11), (7, 22),
(8, 1), (8, 11), (8, 22),
(9, 1), (9, 14),
(10, 1), (10, 13),
(11, 3), (11, 40), (11, 43),
(12, 3), (12, 43), (12, 40),
(13, 3), (13, 40), (13, 43),
(14, 3), (14, 40), (14, 43),
(15, 3), (15, 43), (15, 40),
(17, 3), (17, 40), (17, 50),
(18, 3), (18, 40), (18, 50), (18, 42), (18, 55),
(19, 3), (19, 42), (19, 55),
(20, 3), (20, 40), (20, 43),
(21, 3), (21, 41), (21, 53),
(22, 3), (22, 41), (22, 53),
(23, 3), (23, 41), (23, 53),
(24, 3), (24, 41), (24, 53),
(25, 3), (25, 41), (25, 54),
(26, 4), (26, 61), (26, 71),
(27, 4), (27, 60), (27, 70), (27, 72),
(28, 4), (28, 61), (28, 71),
(29, 4), (29, 60), (29, 70),
(30, 4), (30, 60), (30, 72),
(31, 3), (31, 40), (31, 43),
(32, 3), (32, 40),
(33, 3), (33, 40), (33, 43),
(34, 3), (34, 40), (34, 43),
(35, 3), (35, 40), (35, 43),
(36, 3), (36, 40), (36, 50), (36, 42),
(37, 3), (37, 40), (37, 50), (37, 42),
(38, 3), (38, 42), (38, 55),
(39, 3), (39, 40), (39, 50), (39, 42),
(40, 3), (40, 40), (40, 50), (40, 42);
GO

INSERT INTO BorrowHistory (BookID, UserID, BorrowDate, DueDate, ReturnDate, Status) VALUES
(2, 1, '2026-01-15', '2026-01-29', NULL, 'Borrowed'),
(11, 2, '2026-01-16', '2026-01-30', NULL, 'Borrowed'),
(22, 3, '2026-01-18', '2026-02-01', NULL, 'Borrowed'),
(26, 4, '2026-01-20', '2026-02-03', NULL, 'Borrowed'),
(14, 5, '2026-01-21', '2026-02-04', NULL, 'Borrowed'),
(8, 6, '2025-12-10', '2025-12-24', NULL, 'Overdue'),
(12, 7, '2025-12-15', '2025-12-29', NULL, 'Overdue'),
(10, 8, '2025-12-20', '2026-01-03', NULL, 'Overdue'),
(1, 1, '2026-01-01', '2026-01-15', '2026-01-14', 'Returned'),
(3, 2, '2026-01-02', '2026-01-16', '2026-01-15', 'Returned'),
(11, 3, '2026-01-03', '2026-01-17', '2026-01-16', 'Returned'),
(14, 4, '2026-01-04', '2026-01-18', '2026-01-17', 'Returned'),
(22, 5, '2026-01-05', '2026-01-19', '2026-01-18', 'Returned'),
(26, 6, '2026-01-06', '2026-01-20', '2026-01-19', 'Returned'),
(2, 7, '2025-12-01', '2025-12-15', '2025-12-14', 'Returned'),
(7, 8, '2025-12-02', '2025-12-16', '2025-12-15', 'Returned'),
(11, 9, '2025-12-03', '2025-12-17', '2025-12-16', 'Returned'),
(12, 10, '2025-12-04', '2025-12-18', '2025-12-17', 'Returned'),
(14, 11, '2025-12-05', '2025-12-19', '2025-12-18', 'Returned'),
(18, 12, '2025-12-06', '2025-12-20', '2025-12-19', 'Returned'),
(22, 1, '2025-12-07', '2025-12-21', '2025-12-20', 'Returned'),
(26, 2, '2025-12-08', '2025-12-22', '2025-12-21', 'Returned'),
(27, 3, '2025-12-09', '2025-12-23', '2025-12-22', 'Returned'),
(36, 4, '2025-12-10', '2025-12-24', '2025-12-23', 'Returned'),
(2, 5, '2025-11-01', '2025-11-15', '2025-11-14', 'Returned'),
(2, 6, '2025-11-02', '2025-11-16', '2025-11-15', 'Returned'),
(7, 7, '2025-11-03', '2025-11-17', '2025-11-16', 'Returned'),
(11, 8, '2025-11-04', '2025-11-18', '2025-11-17', 'Returned'),
(11, 9, '2025-11-05', '2025-11-19', '2025-11-18', 'Returned'),
(12, 10, '2025-11-06', '2025-11-20', '2025-11-19', 'Returned'),
(14, 11, '2025-11-07', '2025-11-21', '2025-11-20', 'Returned'),
(14, 12, '2025-11-08', '2025-11-22', '2025-11-21', 'Returned'),
(18, 1, '2025-11-09', '2025-11-23', '2025-11-22', 'Returned'),
(22, 2, '2025-11-10', '2025-11-24', '2025-11-23', 'Returned'),
(22, 3, '2025-11-11', '2025-11-25', '2025-11-24', 'Returned'),
(26, 4, '2025-11-12', '2025-11-26', '2025-11-25', 'Returned'),
(27, 5, '2025-11-13', '2025-11-27', '2025-11-26', 'Returned'),
(28, 6, '2025-11-14', '2025-11-28', '2025-11-27', 'Returned'),
(36, 7, '2025-11-15', '2025-11-29', '2025-11-28', 'Returned'),
(37, 8, '2025-11-16', '2025-11-30', '2025-11-29', 'Returned'),
(2, 9, '2025-10-01', '2025-10-15', '2025-10-14', 'Returned'),
(11, 10, '2025-10-02', '2025-10-16', '2025-10-15', 'Returned'),
(11, 11, '2025-10-03', '2025-10-17', '2025-10-16', 'Returned'),
(14, 12, '2025-10-04', '2025-10-18', '2025-10-17', 'Returned'),
(14, 1, '2025-10-05', '2025-10-19', '2025-10-18', 'Returned'),
(22, 2, '2025-10-06', '2025-10-20', '2025-10-19', 'Returned'),
(26, 3, '2025-10-07', '2025-10-21', '2025-10-20', 'Returned'),
(27, 4, '2025-10-08', '2025-10-22', '2025-10-21', 'Returned'),
(28, 5, '2025-10-09', '2025-10-23', '2025-10-22', 'Returned'),
(36, 6, '2025-10-10', '2025-10-24', '2025-10-23', 'Returned'),
(2, 7, '2025-09-01', '2025-09-15', '2025-09-14', 'Returned'),
(11, 8, '2025-09-02', '2025-09-16', '2025-09-15', 'Returned'),
(14, 9, '2025-09-03', '2025-09-17', '2025-09-16', 'Returned'),
(22, 10, '2025-09-04', '2025-09-18', '2025-09-17', 'Returned'),
(26, 11, '2025-09-05', '2025-09-19', '2025-09-18', 'Returned'),
(27, 12, '2025-09-06', '2025-09-20', '2025-09-19', 'Returned'),
(36, 1, '2025-09-07', '2025-09-21', '2025-09-20', 'Returned'),
(37, 2, '2025-09-08', '2025-09-22', '2025-09-21', 'Returned');
GO

PRINT 'Seed data inserted successfully!';
PRINT '';
PRINT 'Summary:';
SELECT 'Publishers' as TableName, COUNT(*) as RecordCount FROM Publishers
UNION ALL
SELECT 'Authors', COUNT(*) FROM Authors
UNION ALL
SELECT 'Categories', COUNT(*) FROM Categories
UNION ALL
SELECT 'Users', COUNT(*) FROM Users
UNION ALL
SELECT 'Books', COUNT(*) FROM Books
UNION ALL
SELECT 'BookAuthors', COUNT(*) FROM BookAuthors
UNION ALL
SELECT 'BookCategories', COUNT(*) FROM BookCategories
UNION ALL
SELECT 'BorrowHistory', COUNT(*) FROM BorrowHistory;
GO
