const BorrowRecord = require('../../../src/domain/entities/BorrowRecord');

describe('BorrowRecord Entity', () => {
    describe('Constructor and Invariants', () => {
        test('Should create borrow record with valid data', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');

            const record = new BorrowRecord({
                borrowId: 1,
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            expect(record.borrowId).toBe(1);
            expect(record.bookId).toBe(100);
            expect(record.userId).toBe(50);
            expect(record.borrowDate).toEqual(borrowDate);
            expect(record.dueDate).toEqual(dueDate);
            expect(record.returnDate).toBeNull();
            expect(record.status).toBe(BorrowRecord.STATUS.BORROWED);
        });

        test('Should use default values for optional fields', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            expect(record.borrowId).toBeNull();
            expect(record.returnDate).toBeNull();
            expect(record.status).toBe(BorrowRecord.STATUS.BORROWED);
        });

        test('Should enforce invariant: dueDate must be after borrowDate', () => {
            const borrowDate = new Date('2026-01-15');
            const dueDate = new Date('2026-01-10'); // Before borrow date

            expect(() => {
                new BorrowRecord({
                    bookId: 100,
                    userId: 50,
                    borrowDate: borrowDate,
                    dueDate: dueDate
                });
            }).toThrow('Due date must be after borrow date');
        });

        test('Should enforce invariant: returnDate cannot be before borrowDate', () => {
            const borrowDate = new Date('2026-01-10');
            const dueDate = new Date('2026-01-20');
            const returnDate = new Date('2026-01-05'); // Before borrow date

            expect(() => {
                new BorrowRecord({
                    bookId: 100,
                    userId: 50,
                    borrowDate: borrowDate,
                    dueDate: dueDate,
                    returnDate: returnDate
                });
            }).toThrow('Return date cannot be before borrow date');
        });

        test('Should enforce invariant: status must be valid', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');

            expect(() => {
                new BorrowRecord({
                    bookId: 100,
                    userId: 50,
                    borrowDate: borrowDate,
                    dueDate: dueDate,
                    status: 'InvalidStatus'
                });
            }).toThrow('Status must be one of');
        });
    });

    describe('Static Constants', () => {
        test('Should have correct STATUS constants', () => {
            expect(BorrowRecord.STATUS.BORROWED).toBe('Borrowed');
            expect(BorrowRecord.STATUS.RETURNED).toBe('Returned');
            expect(BorrowRecord.STATUS.OVERDUE).toBe('Overdue');
        });
    });

    describe('Computed Properties - isOverdue', () => {
        test('isOverdue should return false when book not yet due', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-12-31'); // Far in future

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            expect(record.isOverdue).toBe(false);
        });

        test('isOverdue should return true when book is past due date', () => {
            const borrowDate = new Date('2025-01-01');
            const dueDate = new Date('2025-01-15'); // Past date

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            expect(record.isOverdue).toBe(true);
        });

        test('isOverdue should return false when book already returned (even if was late)', () => {
            const borrowDate = new Date('2025-01-01');
            const dueDate = new Date('2025-01-15');
            const returnDate = new Date('2025-01-20'); // Returned late

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: returnDate,
                status: BorrowRecord.STATUS.RETURNED
            });

            expect(record.isOverdue).toBe(false);
        });
    });

    describe('Computed Properties - daysOverdue', () => {
        test('daysOverdue should return 0 when not overdue', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-12-31');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            expect(record.daysOverdue).toBe(0);
        });

        test('daysOverdue should return 0 when already returned', () => {
            const borrowDate = new Date('2025-01-01');
            const dueDate = new Date('2025-01-15');
            const returnDate = new Date('2025-01-20');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: returnDate,
                status: BorrowRecord.STATUS.RETURNED
            });

            expect(record.daysOverdue).toBe(0);
        });
    });

    describe('Computed Properties - isReturned', () => {
        test('isReturned should return false when returnDate is null', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            expect(record.isReturned).toBe(false);
        });

        test('isReturned should return true when returnDate is set', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');
            const returnDate = new Date('2026-01-10');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: returnDate
            });

            expect(record.isReturned).toBe(true);
        });
    });

    describe('Business Methods - markAsReturned', () => {
        test('markAsReturned should return new instance with returnDate set', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');

            const original = new BorrowRecord({
                borrowId: 1,
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            const returnDate = new Date('2026-01-10');
            const returned = original.markAsReturned(returnDate);

            // Original unchanged (immutability)
            expect(original.returnDate).toBeNull();
            expect(original.status).toBe(BorrowRecord.STATUS.BORROWED);

            // New instance updated
            expect(returned.returnDate).toEqual(returnDate);
            expect(returned.status).toBe(BorrowRecord.STATUS.RETURNED);
            expect(returned.borrowId).toBe(1);
            expect(returned.bookId).toBe(100);
        });

        test('markAsReturned should fail if already returned (precondition violation)', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');
            const returnDate = new Date('2026-01-10');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: returnDate,
                status: BorrowRecord.STATUS.RETURNED
            });

            expect(() => {
                record.markAsReturned();
            }).toThrow('Book has already been returned');
        });

        test('markAsReturned should fail if returnDate before borrowDate', () => {
            const borrowDate = new Date('2026-01-10');
            const dueDate = new Date('2026-01-20');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            const invalidReturnDate = new Date('2026-01-05'); // Before borrow date

            expect(() => {
                record.markAsReturned(invalidReturnDate);
            }).toThrow('Return date cannot be before borrow date');
        });
    });

    describe('Business Methods - calculateLateFee', () => {
        test('calculateLateFee should return 0 when not overdue', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-12-31');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            expect(record.calculateLateFee()).toBe(0);
        });

        test('calculateLateFee should calculate fee for returned late book', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-10');
            const returnDate = new Date('2026-01-15'); // 5 days late

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: returnDate,
                status: BorrowRecord.STATUS.RETURNED
            });

            // 5 days late * $0.50 = $2.50
            expect(record.calculateLateFee(0.50)).toBe(2.50);
        });

        test('calculateLateFee should use custom fee per day', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-10');
            const returnDate = new Date('2026-01-13'); // 3 days late

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: returnDate,
                status: BorrowRecord.STATUS.RETURNED
            });

            // 3 days late * $1.00 = $3.00
            expect(record.calculateLateFee(1.00)).toBe(3.00);
        });
    });

    describe('Immutable Update Pattern', () => {
        test('update() should return new instance with updated dueDate', () => {
            const borrowDate = new Date('2026-01-01');
            const originalDueDate = new Date('2026-01-15');

            const original = new BorrowRecord({
                borrowId: 1,
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: originalDueDate
            });

            const newDueDate = new Date('2026-01-20');
            const updated = original.update({ dueDate: newDueDate });

            // Original unchanged
            expect(original.dueDate).toEqual(originalDueDate);

            // New instance updated
            expect(updated.dueDate).toEqual(newDueDate);
            expect(updated.borrowId).toBe(1);
            expect(updated.bookId).toBe(100);
        });

        test('update() should handle undefined with nullish coalescing', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');

            const record = new BorrowRecord({
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            const updated = record.update({ status: undefined });

            // Should keep original status
            expect(updated.status).toBe(BorrowRecord.STATUS.BORROWED);
        });
    });

    describe('toJSON Serialization', () => {
        test('toJSON() should return all properties including computed properties', () => {
            const borrowDate = new Date('2026-01-01');
            const dueDate = new Date('2026-01-15');

            const record = new BorrowRecord({
                borrowId: 1,
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate
            });

            const json = record.toJSON();

            expect(json).toEqual({
                borrowId: 1,
                bookId: 100,
                userId: 50,
                borrowDate: borrowDate,
                dueDate: dueDate,
                returnDate: null,
                status: BorrowRecord.STATUS.BORROWED,
                isOverdue: expect.any(Boolean),
                daysOverdue: expect.any(Number),
                isReturned: false
            });
        });
    });
});