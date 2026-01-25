const Book = require('../../../src/domain/entities/Book');

describe('Book Entity', () => {
    describe('Constructor and Invariants', () => {
        test('Should create book with valid data', () => {
            const book = new Book({
                isbn: '978-0-123456-47-2',
                title: 'Clean Architecture',
                totalCopies: 5,
                availableCopies: 3
            });

            expect(book.isbn).toBe('978-0-123456-47-2');
            expect(book.title).toBe('Clean Architecture');
            expect(book.totalCopies).toBe(5);
            expect(book.availableCopies).toBe(3);
        });

        test('Should enforce invariant: totalCopies >=1', () => {
            expect(() => {
                new Book({
                    isbn: '978-0-123456-47-2',
                    title: 'Test Book',
                    totalCopies: 0
                });
            }).toThrow('Total copies must be at least 1');
        });

        test('Should enforce invariant: availableCopies <= totalCopies ', () => {
            expect(() => {
                new Book({
                    isbn: '978-0-123456-47-2',
                    title: 'Test Book',
                    totalCopies: 5,
                    availableCopies: 6
                });
            }).toThrow('Available copies cannot exceed total copies');
        });

    });

    describe('Business Methods - Design by Contract', () => {
        test('borrow() should decrease available copies', () => {
            const book = new Book({
                isbn: '978-0-123456-47-2',
                title: 'Test Book',
                totalCopies: 5,
                availableCopies: 3
            });

            book.borrow();
            expect(book.availableCopies).toBe(2);
        });

        test('borrow() should fail when no copies available (precondition violation)', () => {
            const book = new Book({
                isbn: '978-0-123456-47-2',
                title: 'Test Book',
                totalCopies: 5,
                availableCopies: 0
            });

            expect(() => book.borrow()).toThrow('is not available for borrowing');
        });

        test('returnCopy() should increase available copies', () => {
            const book = new Book({
                isbn: '978-0-123456-47-2',
                title: 'Test Book',
                totalCopies: 5,
                availableCopies: 2
            });

            book.returnCopy();
            expect(book.availableCopies).toBe(3)
        });

        test('returnCopy() should fail when all copies already available', () => {
            const book = new Book({
                isbn: '978-0-123456-47-2',
                title: 'Test Book',
                totalCopies: 5,
                availableCopies: 5
            });

            expect(() => book.returnCopy()).toThrow('all copies already available');
        });
    });
});

