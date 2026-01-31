const Author = require('../../../src/domain/entities/Author');

describe('Author Entity', () => {
    describe('Constructor and Invariants', () => {
        test('Should create author with valid data',() => {
            const author = new Author({
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Software craftsman and author of Clean Code',
                birthDate: new Date('1952-12-05'),
                country: 'USA'
            });

            expect(author.authorId).toBe(1);
            expect(author.firstName).toBe('Robert');
            expect(author.lastName).toBe('Martin');
            expect(author.fullName).toBe('Robert Martin');
            expect(author.biography).toBe('Software craftsman and author of Clean Code');
            expect(author.birthDate).toEqual(new Date('1952-12-05'));
            expect(author.country).toBe('USA');
        });

        test('Should enforce invariant: firstName is required', () => {
            expect(() => {
                new Author({
                    firstName:'',
                    lastName: 'Martin'
                });
            }).toThrow('First name is required');
        });

        test('Should enforce invariant: lastName is required', () => {
            expect(() => {
                new Author({
                    firstName:'Robert',
                    lastName: ''
                });
            }).toThrow('Last name is required');
        });
        
        test('Should enforce invariant: birthdate must be in the past', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);

            expect(() => {
                new Author({
                    firstName: 'Robert',
                    lastName: 'Martin',
                    birthDate: futureDate
                });
            }).toThrow('birthDate must be in the past');
        });

        test('Should allow optional fields(biography, birthDate, country)', () => {
            const author = new Author({
                firstName: 'Robert',
                lastName: 'Martin'
            });

            expect(author.biography).toBe('');
            expect(author.birthDate).toBeNull();
            expect(author.country).toBe('');
        });
    });

    describe('Immutable Update Pattern', () => {
        test('update() should return new Author instance', () => {
            const original = new Author({
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Original bio',
                country: 'USA'
            });

            const updated = original.update({
                biography: 'Updated bio'
            });

            expect(original.biography).toBe('Original bio');
            expect(updated.biography).toBe('Updated bio');
            expect(updated.firstName).toBe('Robert');
            expect(updated.lastName).toBe('Martin');
            expect(updated.country).toBe('USA');
        });

        test('update() should handle null/undefined with nullish coalescing', () => {
            const author = new Author({
                firstName: 'Robert',
                lastName: 'Martin',
                country: 'USA'
            });

            const updated = author.update({
                country: undefined
            });

            expect(updated.country).toBe('USA');
        });
    });

    describe('fullName Computed Property', () => {
        test('fullName should combine firstName and lastName', () => {
            const author = new Author({
                firstName: 'Martin',
                lastName: 'Fowler'
            });

            expect(author.fullName).toBe('Martin Fowler');
        });
    });

    describe('toJSON Serialization', () => {
        test('toJSON() should return all properties including computed fullName', () => {
            const author = new Author({
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                biography: 'Clean Code author',
                birthDate: new Date('1952-12-05'),
                country: 'USA'
            });

            const json = author.toJSON();

            expect(json).toEqual({
                authorId: 1,
                firstName: 'Robert',
                lastName: 'Martin',
                fullName: 'Robert Martin',
                biography: 'Clean Code author',
                birthDate: new Date('1952-12-05'),
                country: 'USA'
            });
        });
    });
});

