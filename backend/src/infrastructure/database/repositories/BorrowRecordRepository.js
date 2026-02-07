const BorrowRecord = require('../../../../src/domain/entities/BorrowRecord');
const IBorrowRecordRepository = require('../../../domain/contracts/IBorrowRecordRepository');

/**
 * BorrowRecordRepository - SQL Server Implementation
 * Implements IBorrowRecordRepository contract using T-SQL
*/

class BorrowRecordRepository extends IBorrowRecordRepository {
    constructor(dbConnection) {
        super();
        this.db = dbConnection;
    }

    async findById(borrowId) {
        try {
            const query = `
                SELECT
                    br.BorrowID as borrowId,
                    br.BookID as bookId,
                    br.UserID as userId,
                    br.BorrowDate as borrowDate,
                    br.DueDate as dueDate,
                    br.ReturnDate as returnDate,
                    br.Status as status
                FROM BorrowHistory br
                WHERE br.BorrowID = @borrowId;
            `;

            const result = await this.db.query(query, { borrowId });
            if (result.recordset.length === 0) return null;

            const row = result.recordset[0];
            return new BorrowRecord({
                borrowId: row.borrowId,
                bookId: row.bookId,
                userId: row.userId,
                borrowDate: row.borrowDate,
                dueDate: row.dueDate,
                returnDate: row.returnDate,
                status: row.status
            });

        } catch (error) {
            throw new Error(`Failed to find borrow record by ID: ${error.message}`);
        }
    }

    async findbyCriteria({
        userId = null,
        bookId = null,
        status = null,
        page = 1,
        pageSize = 20
    }) {
        try {
            const offset = (page - 1) * pageSize;

            const query = `
                SELECT
                    br.BorrowID as borrowId,
                    br.BookID as bookId,
                    br.UserID as userId,
                    br.BorrowDate as borrowDate,
                    br.DueDate as dueDate,
                    br.ReturnDate as returnDate,
                    br.Status as status
                FROM BorrowHistory br
                WHERE
                    (@userId IS NULL OR br.UserID = @userId)
                    AND (@bookId IS NULL OR br.BookID = @bookId)
                    AND (@status IS NULL or br.Status = @status)
                ORDER BY br.BorrowDate DESC
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY;\
            `;

            const result = await this.db.query(query,
                { userId, bookId, status, offset, pageSize });

            return result.recordset.map(row => new BorrowRecord({
                borrowId: row.borrowId,
                bookId: row.bookId,
                userId: row.userId,
                borrowDate: row.borrowDate,
                dueDate: row.dueDate,
                returnDate: row.returnDate,
                status: row.status
            }));

        } catch (error) {
            throw new Error(`Failed to find borrow records by criteria: ${error.message}`)
        }
    }

    async findActiveByUserId(userId) {
        try {
            const query = `
                SELECT
                    br.BorrowID as borrowId,
                    br.BookID as bookId,
                    br.UserID as userId,
                    br.BorrowDate as borrowDate,
                    br.DueDate as dueDate,
                    br.ReturnDate as returnDate,
                    br.Status as status
                FROM BorrowHistory br
                WHERE br.UserID = @userId
                    AND br.Status = 'Borrowed'
                    AND br.ReturnDate IS NULL
                ORDER BY br.BorrowDate DESC;
            `;

            const request = this.db.request();
            request.input('userId', userId);
            const result = await request.query(query);

            return result.recordset.map(row => new BorrowRecord({
                borrowId: row.borrowId,
                bookId: row.bookId,
                userId: row.userId,
                borrowDate: row.borrowDate,
                dueDate: row.dueDate,
                returnDate: row.returnDate,
                status: row.status
            }));

        } catch (error) {
            throw new Error(`Failed to find borrow records by user: ${error.message}`);
        }
    }

    async findAllActive() {
        try {
            const query = `
                SELECT
                    br.BorrowID as borrowId,
                    br.BookID as bookId,
                    br.UserID as userId,
                    br.BorrowDate as borrowDate,
                    br.DueDate as dueDate,
                    br.ReturnDate as returnDate,
                    br.Status as status
                FROM BorrowHistory br
                WHERE br.Status = 'Borrowed'
                    AND br.ReturnDate IS NULL
                ORDER BY br.BorrowDate DESC;
            `;

            const request = this.db.request();
            const result = await request.query(query);

            return result.recordset.map(row => new BorrowRecord({
                borrowId: row.borrowId,
                bookId: row.bookId,
                userId: row.userId,
                borrowDate: row.borrowDate,
                dueDate: row.dueDate,
                returnDate: row.returnDate,
                status: row.status
            }));

        } catch (error) {
            throw new Error(`Failed to find borrow records by user: ${error.message}`);
        }
    }

    async findOverdue() {
        try {
            const query = `
                SELECT
                    br.BorrowID as borrowId,
                    br.BookID as bookId,
                    br.UserID as userId,
                    br.BorrowDate as borrowDate,
                    br.DueDate as dueDate,
                    br.ReturnDate as returnDate,
                    br.Status as status,
                    DATEDIFF(day, br.DueDate, GETUTCDATE()) as daysOverdue
                FROM BorrowHistory br
                WHERE br.ReturnDate IS NULL
                    AND br.DueDate < GETUTCDATE()
                ORDER BY br.BorrowDate DESC;
            `;

            const result = await this.db.query(query);

            return result.recordset.map(row => new BorrowRecord({
                borrowId: row.borrowId,
                bookId: row.bookId,
                userId: row.userId,
                borrowDate: row.borrowDate,
                dueDate: row.dueDate,
                returnDate: row.returnDate,
                status: row.status
            }));

        } catch (error) {
            throw new Error(`Failed to find overdue borrow records: ${error.message}`);
        }
    }

    async save(borrowRecord) {
        if (!(borrowRecord instanceof BorrowRecord)) {
            throw new Error('Invalid borrow record entity');
        }

        try {
            // If borrowId exists, UPDATE; else INSERT
            if (borrowRecord.borrowId) {
                const query = `
                    UPDATE BorrowHistory
                    SET
                        DueDate = @dueDate,
                        ReturnDate = @returnDate,
                        Status = @status
                    WHERE BorrowID = @borrowId

                    SELECT
                        br.BorrowID as borrowId,
                        br.BookID as bookId,
                        br.UserID as userId,
                        br.BorrowDate as borrowDate,
                        br.DueDate as dueDate,
                        br.ReturnDate as returnDate,
                        br.Status as status
                    FROM BorrowHistory br
                    WHERE BorrowID = @borrowId;
                `;

                const result = await this.db.query(query, {
                    borrowId: borrowRecord.borrowId,
                    dueDate: borrowRecord.dueDate,
                    returnDate: borrowRecord.returnDate,
                    status: borrowRecord.status
                });

                const row = result.recordset[0];
                return new BorrowRecord({
                    borrowId: row.borrowId,
                    bookId: row.bookId,
                    userId: row.userId,
                    borrowDate: row.borrowDate,
                    dueDate: row.dueDate,
                    returnDate: row.returnDate,
                    status: row.status
                });

            } else {
                const query = `
                    INSERT INTO BorrowHistory (BookID, UserID, BorrowDate, DueDate, ReturnDate, Status)
                    OUTPUT
                        INSERTED.BorrowID as borrowId,
                        INSERTED.BookID as bookId,
                        INSERTED.UserID as userId,
                        INSERTED.BorrowDate as borrowDate,
                        INSERTED.DueDate as dueDate,
                        INSERTED.ReturnDate as returnDate,
                        INSERTED.Status as status
                    VALUES (@bookId, @userId, @borrowDate, @dueDate, @returnDate, @status);
                `;

                const result = await this.db.query(query, {
                    bookId: borrowRecord.bookId,
                    userId: borrowRecord.userId,
                    dueDate: borrowRecord.dueDate,
                    returnDate: borrowRecord.returnDate,
                    status: borrowRecord.status
                });

                const row = result.recordset[0];
                return new BorrowRecord({
                    borrowId: row.borrowId,
                    bookId: row.bookId,
                    userId: row.userId,
                    borrowDate: row.borrowDate,
                    dueDate: row.dueDate,
                    returnDate: row.returnDate,
                    status: row.status
                });
            }
        } catch (error) {
            throw new Error(`Failed to save borrow record: ${error.message}`);
        }
    }

    async getStatistics() {
        try {
            const query = `
                SELECT
                    COUNT(*) as totalBorrows,
                    SUM(CASE WHEN ReturnDate IS NULL THEN 1 ELSE 0 END) as activeBorrows,
                    SUM(CASE WHEN ReturnDate IS NULL AND DueDate < GETUTCDATE() THEN 1 ELSE 0) as overdueCount,
                    AVG(DATEDIFF(day, BorrowDate, COALESCE(ReturnDate, GETUTCDATE()))) as avgBorrowDays
                FROM BorrowHistory;
            `;

            const request = this.db.request();
            const result = await request.query(query);
            return result.recordset[0];

        } catch (error) {
            throw new Error(`Failed to get borrow statistics: ${error.message}`);
        }
    }
}

module.exports = BorrowRecordRepository;