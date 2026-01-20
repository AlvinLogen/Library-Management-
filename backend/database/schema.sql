IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'BookLibrary')
BEGIN 
    CREATE DATABASE BookLibrary;
END
GO

USE BookLibrary;
GO

DROP TABLE IF EXISTS Book;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS BookAuthors;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS BookCategories;
DROP TABLE IF EXISTS Publishers;
DROP TABLE IF EXISTS BorrowHistory;
DROP TABLE IF EXISTS Users;
GO

CREATE TABLE Books (
    BookID INT IDENTITY(1,1) PRIMARY KEY,
    ISBN VARCHAR(13) UNIQUE NOT NULL,
    Title NVARCHAR(255) NOT NULL,
    PublicationDate DATE,
    PublisherID INT,
    TotalCopies INT DEFAULT 1,
    AvailableCopies INT DEFAULT 1,
    Description NVARCHAR(MAX),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 DEFAULT GETUTCDATE(),

    CONSTRAINT CHK_AvailableCopies CHECK(AvailableCopies >= 0 AND AvailableCopies <= TotalCopies),
    CONSTRAINT CHK_ISBN CHECK(LEN(ISBN) IN (10,13))
);

CREATE TABLE Authors(
    AuthorID INT IDENTITY(1,1) PRIMARY KEY,
    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NOT NULL,
    Biography NVARCHAR(MAX),
    BirthDate DATE,
    Country NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    CONSTRAINT CHK_BirthDate CHECK(BirthDate <= GETDATE())
);

CREATE TABLE BookAuthors(
    BookAuthorID INT IDENTITY(1,1) PRIMARY KEY,
    BookID INT NOT NULL,
    AuthorID INT NOT NULL,
    DisplayOrder INT DEFAULT 1,

    CONSTRAINT FK_BookAuthors_Books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
    CONSTRAINT FK_BookAuthors_Authors FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID) ON DELETE CASCADE,
    CONSTRAINT UQ_BookAuthor UNIQUE(BookID, AuthorID)
);

CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(100) NOT NULL,
    ParentCategoryID INT NULL,
    Description NVARCHAR(500),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    CONSTRAINT FK_Categories_Parent FOREIGN KEY (ParentCategoryID) REFERENCES Categories(CategoryID)
);

CREATE TABLE BookCategories(
    BookCategoryID INT IDENTITY(1,1) PRIMARY KEY,
    BookID INT NOT NULL,
    CategoryID INT NOT NULL,

    CONSTRAINT FK_BookCategories_Books FOREIGN KEY (BookID) REFERENCES Books(BookID) ON DELETE CASCADE,
    CONSTRAINT FK_BookCategories_Categories FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID) ON DELETE CASCADE,
    CONSTRAINT UQ_BookCategory UNIQUE (BookID, CategoryID)
);

CREATE TABLE Publishers (
    PublisherID INT IDENTITY(1,1) PRIMARY KEY,
    PublisherName NVARCHAR(200) NOT NULL,
    Country NVARCHAR(100),
    Website NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETUTCDATE()
);

CREATE TABLE Users(
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(100) UNIQUE NOT NULL,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    FullName NVARCHAR(200),
    MembershipDate DATE DEFAULT CAST(GETUTCDATE() AS DATE),
    IsActive BIT DEFAULT 1,
    CreatedAt DATETIME2 DEFAULT GETUTCDATE(),

    CONSTRAINT CHK_Email CHECK(Email LIKE '%@%')
);

CREATE TABLE BorrowHistory(
    BorrowID INT IDENTITY(1,1) PRIMARY KEY,
    BookID INT NOT NULL,
    UserID INT NOT NULL,
    BorrowDate DATETIME2 DEFAULT GETUTCDATE(),
    DueDate DATETIME2,
    ReturnDate DATETIME2 NULL,
    Status NVARCHAR(20) DEFAULT 'Borrowed'

    CONSTRAINT FK_BorrowHistory_Books FOREIGN KEY (BookID) REFERENCES Books(BookID),
    CONSTRAINT CHK_Status CHECK (Status IN ('Borrowed', 'Returned', 'Overdue')),
    CONSTRAINT CHK_DueDate CHECK (DueDate > BorrowDate),
    CONSTRAINT CHK_ReturnDate CHECK (ReturnDate IS NULL OR ReturnDate >= BorrowDate)

);

--Performance Optimization Indexes
CREATE NONCLUSTERED INDEX IX_Books_Title ON Books(Title);
CREATE NONCLUSTERED INDEX IX_Books_ISBN ON Books(ISBN);
CREATE NONCLUSTERED INDEX IX_BookAuthors_AuthorID ON BookAuthors(AuthorID);
CREATE NONCLUSTERED INDEX IX_BookCategories_CategoryID ON BookCategories(BookCategoryID);
CREATE NONCLUSTERED INDEX IX_BorrowHistory_BookID_Status ON BorrowHistory(BookID, Status) INCLUDE (BorrowDate, ReturnDate);
CREATE NONCLUSTERED INDEX IX_BorrowHistory_UserID ON BorrowHistory(UserID);
CREATE NONCLUSTERED INDEX IX_Categories_ParentID ON Categories(ParentCategoryID);