/**
 * Author Entity - Domain Model
 * Represents an author in the library system
 * 
 * Design by Contract:
 * - Invariants: firstName and lastName required
 * - Business rules encapsulated
 */

class Author {
    #authorId;
    #firstName;
    #lastName;
    #biography;
    #birthDate;
    #country;

    constructor({
        authorId = null,
        firstName,
        lastName,
        biography = '',
        birthDate = null,
        country = ''
    }){
        // Validate invariants (Design by Contract)
        this.#validateInvariants(firstName, lastName, birthDate);

        this.#authorId = authorId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#biography = biography;
        this.#birthDate = birthDate;
        this.#country = country;
    }

    // Invariant validateion
    #validateInvariants(firstName, lastName, birthDate){
        const currentDate = new Date();

        if(birthDate && birthDate >= currentDate){
            throw new Error('birthDate must be in the past');
        }

        if(!firstName || firstName.trim().length === 0){
            throw new Error('First name is required')
        }

        if(!lastName || lastName.trim().length === 0){
            throw new Error('Last name is required')
        }
    }

    // Getters (immutable access)
    get authorId() { return this.#authorId; }
    get firstName() { return this.#firstName; }
    get lastName() { return this.#lastName; }
    get fullName() { return `${this.#firstName} ${this.#lastName}`; }
    get biography() { return this.#biography; }
    get birthDate() { return this.#birthDate; }
    get country() { return this.#country; }

    // Value object pattern - return new instance for updates
    update({ firstName, lastName, biography, birthDate, country }){
        return new Author({
            authorId: this.#authorId,
            firstName: firstName ?? this.#firstName,
            lastName: lastName ?? this.#lastName,
            biography: biography ?? this.#biography,
            birthDate: birthDate ?? this.#birthDate,
            country: country ?? this.#country
        });
    }

    toJSON(){
        return {
            authorId: this.#authorId,
            firstName: this.#firstName,
            lastName: this.#lastName,
            fullName: this.fullName,
            biography: this.#biography,
            birthDate: this.#birthDate,
            country: this.#country
        }
    }
}

module.exports = Author;