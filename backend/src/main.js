/**
 * main.js - Composition Root
 * Wires all dependencies together (Clean Architecture principles)
 * 
 * PATTERN: Dependency Injection Container (manual)
*/

const createApp = require('./infrastructure/web/app');

// Database configuration
const dbConfig = require('./infrastructure/database/config');

// Repositories (Infrastructure Layer)
const BookRepository = require('./infrastructure/database/repositories/BookRepository');
const AuthorRepository = require('./infrastructure/database/repositories/AuthorRepository');
const BorrowRecordRepository = require('./infrastructure/database/repositories/BorrowRecordRepository');

// Use Cases (Application Layer)
// Book Use Cases
const GetBook = require('./application/usecases/book/GetBook');
const SearchBooks = require('./application/usecases/book/SearchBooks');
const CreateBook = require('./application/usecases/book/CreateBook');
const UpdateBook = require('./application/usecases/book/UpdateBook');
const GetBookAnalytics = require('./application/usecases/book/GetBookAnalytics');
const GetCategoryHierarchy = require('./application/usecases/book/GetCategoryHierarchy');

// Author Use Cases
const GetAuthor = require('./application/usecases/author/GetAuthor');
const CreateAuthor = require('./application/usecases/author/CreateAuthor');
const UpdateAuthor = require('./application/usecases/author/UpdateAuthor');
const DeleteAuthor = require('./application/usecases/author/DeleteAuthor');

// Borrow Use Cases
const BorrowBook = require('./application/usecases/borrow/BorrowBook');
const ReturnBook = require('./application/usecases/borrow/ReturnBook');
const GetOverdueBooks = require('./application/usecases/borrow/GetOverdueBooks');
const GetUserBorrowHistory = require('./application/usecases/borrow/GetUserBorrowHistory');
const GetBorrowStatistics = require('./application/usecases/borrow/GetBorrowStatistics');
const GetActiveBorrows = require('./application/usecases/borrow/GetActiveBorrows');

// Controllers (Infrastructure / Web Layer)
const BookController = require('./infrastructure/web/controllers/BookController');
const AuthorController = require('./infrastructure/web/controllers/AuthorController');
const BorrowController = require('./infrastructure/web/controllers/BorrowController');

// Routes
const createBookRoutes = require('./infrastructure/web/routes/bookRoutes');
const createAuthorRoutes = require('./infrastructure/web/routes/authorRoutes');
const createBorrowRoutes = require('./infrastructure/web/routes/borrowRoutes');

// 6. Start Server
async function startServer() {
    try {
        const dbPool = await dbConfig.getConnection();
        console.log('Database connected');

        /**
         * Composition root - Manual Dependency Injection
         * Order: Repositories -> Use Cases -> Controllers -> Routes -> App
        */

        // 1. Instantiate Repositories (Infrastructure Layer)
        const bookRepository = new BookRepository(dbPool);
        const authorRepository = new AuthorRepository(dbPool);
        const borrowRecordRepository = new BorrowRecordRepository(dbPool);

        // 2. Instantiate Use Cases (Application Layer)
        // Book Use Cases
        const getBookUseCase = new GetBook(bookRepository);
        const searchBooksUseCase = new SearchBooks(bookRepository);
        const createBookUseCase = new CreateBook(bookRepository);
        const updateBookUseCase = new UpdateBook(bookRepository);
        const getBookAnalyticsUseCase = new GetBookAnalytics(bookRepository);
        const getCategoryHierarchyUseCase = new GetCategoryHierarchy(bookRepository);

        // Author Use Cases
        const getAuthorUseCase = new GetAuthor(authorRepository);
        const createAuthorUseCase = new CreateAuthor(authorRepository);
        const updateAuthorUseCase = new UpdateAuthor(authorRepository);
        const deleteAuthorUseCase = new DeleteAuthor(authorRepository);

        // Borrow Use Cases
        const borrowBookUseCase = new BorrowBook(borrowRecordRepository, bookRepository);
        const returnBookUseCase = new ReturnBook(borrowRecordRepository, bookRepository);
        const getOverdueBooksUseCase = new GetOverdueBooks(borrowRecordRepository);
        const getUserBorrowHistoryUseCase = new GetUserBorrowHistory(borrowRecordRepository);
        const getBorrowStatisticsUseCase = new GetBorrowStatistics(borrowRecordRepository);
        const getActiveBorrowsUseCase = new GetActiveBorrows(borrowRecordRepository);

        // 3. Instantiate Controllers (Infrastructure/Web Layer)
        const bookController = new BookController({
            getBookUseCase,
            searchBooksUseCase,
            createBookUseCase,
            updateBookUseCase,
            deleteBookUseCase: null,
            getBookAnalyticsUseCase,
            getCategoryHierarchyUseCase
        });

        const authorController = new AuthorController({
            getAuthorUseCase,
            createAuthorUseCase,
            updateAuthorUseCase,
            deleteAuthorUseCase
        });

        const borrowController = new BorrowController({
            borrowBookUseCase,
            returnBookUseCase,
            getOverdueBooksUseCase,
            getUserBorrowHistoryUseCase,
            getBorrowStatisticsUseCase,
            getActiveBorrowsUseCase
        });

        // 4. Create Routes (passing controllers as dependencies)
        const bookRoutes = createBookRoutes(bookController);
        const authorRoutes = createAuthorRoutes(authorController);
        const borrowRoutes = createBorrowRoutes(borrowController);

        // 5. Create Express App
        const app = createApp({
            bookRoutes,
            authorRoutes,
            borrowRoutes
        });

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Book Library API running on port ${PORT}`);
            console.log(`API Endpoints:`);
            console.log(`Books: http://localhost:${PORT}/api/books`);
            console.log(`Authors: http://localhost:${PORT}/api/authors`);
            console.log(`Borrows: http://localhost:${PORT}/api/borrows`);
        });


    } catch (error) {
        console.error('Failed to start server: ', error.message);
    }
}

startServer();

module.exports = createApp;