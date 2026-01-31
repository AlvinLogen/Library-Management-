/**
 * Book Entity - Domain Model
 * Represents a book in the library system
 * 
 * Design by Contract:
 * - Invariants: availableCopies <= totalCopies, totalCopies > 0
 * - Business rules encapsulated, no infrastructure dependencies
 */
class Book {
    #bookId;
    #isbn;
    #title;
    #totalCopies;
    #availableCopies;
    #publicationDate;
    #description;

    constructor({
        bookId = null,
        isbn,
        title,
        totalCopies = 1,
        availableCopies = null,
        publicationDate = null,
        description = ''
    }) {
        // validate invariants (design by contract)
        this.#validateInvariants(totalCopies, availableCopies);

        this.#bookId = bookId;
        this.#isbn = isbn;
        this.#title = title;
        this.#totalCopies = totalCopies;
        this.#availableCopies = availableCopies ?? totalCopies;
        this.#publicationDate = publicationDate;
        this.#description = description;
    }

    // Invariant validation
    #validateInvariants(totalCopies, availableCopies){
        if(totalCopies < 1){
            throw new Error('Total copies must be at least 1');
        }

        if(availableCopies !== null && availableCopies > totalCopies){
            throw new Error('Available copies cannot exceed total copies');
        }

        if(availableCopies !== null && availableCopies < 0){
            throw new Error('Available copies cannot be negative');
        }
    }

    // Getters (immutable access - read-only)
    get bookId() {return this.#bookId; }
    get isbn(){ return this.#isbn; }
    get title(){ return this.#title; }
    get totalCopies() { return this.#totalCopies; }
    get availableCopies(){ return this.#availableCopies; }
    get publicationDate() {return this.#publicationDate;}
    get description(){ return this.#description; }

    // Business Methods 
    canBorrow() {
        return this.#availableCopies > 0;
    }

    borrow() {
        // @precondition: canBorrow() must be true
        if(!this.canBorrow()){
            throw new Error(`Book "${this.#title}" is not available for borrowing`);
        }
        this.#availableCopies--;
    }

    returnCopy() {
        // @precondition: book must have been borrowed (availableCopies < totalCopies)
        if(this.#availableCopies >= this.#totalCopies){
            throw new Error(`Cannot return book "${this.#title}" - all copies already available`);
        }
        this.#availableCopies++;
    }

    // Value Object Pattern - Return new Instance for Updates
    update({ title, description, totalCopies}){
        return new Book({
            bookId: this.#bookId,
            isbn: this.#isbn,
            title: title ?? this.#title,
            description: description ?? this.#description,
            totalCopies: totalCopies ?? this.#totalCopies,
            availableCopies: this.#availableCopies,
            publicationDate: this.#publicationDate
        });
    }

    // Serialization for persistance
    toJSON(){
        return {
            bookId: this.#bookId,
            isbn: this.#isbn,
            title: this.#title,
            description: this.#description,
            totalCopies: this.#totalCopies,
            availableCopies: this.#availableCopies,
            publicationDate: this.#publicationDate            
        };
    }
}

module.exports = Book;