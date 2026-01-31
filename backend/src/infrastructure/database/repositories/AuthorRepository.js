const Author = require('../../../domain/entities/Author');
const IAuthorRepository = require('../../../domain/contracts/IAuthorRepository');

/**
 * AuthorRepository - SQL Server implementation
 * Implements IAuthorRepository contract using T-SQL
 */

class AuthorRepository extends IAuthorRepository {
    constructor(dbConnection){
        super();
        this.db = dbConnection;
    }

    async findById(authorId){
        try {
            const query = `
                SELECT 
                    a.AuthorID as authorId, 
                    a.FirstName as firstName, 
                    a.LastName as lastName, 
                    a.Biography as biography, 
                    a.BirthDate as birthDate, 
                    a.Country as country
                FROM Authors a
                WHERE a.AuthorID = @authorId;
            `;

            const result = await this.db.query(query, {authorId});

            if(result.recordset.length === 0) return null;

            const row = result.recordset[0];
            return new Author({
                authorId: row.authorId,
                firstName: row.firstName,
                lastName: row.lastName,
                biography: row.biography,
                birthDate: row.birthDate,
                country: row.country
            });            
        } catch (error) {
            throw new Error(`Failed to find author by ID: ${error.message}`)
        }
    }

    async findByCriteria({
        searchTerm = '',
        country = null,
        page = 1,
        pageSize = 20
    }){
        try {
            const offset = ( page - 1) * pageSize;
            const query = `
                SELECT
                    a.AuthorID as authorId,
                    a.FirstName as firstName,
                    a.LastName as lastName,
                    a.Biography as biography,
                    a.BirthDate as birthDate,
                    a.Country as country,
                    COUNT(DISTINCT ba.BookID) as bookCount
                FROM Authors a
                LEFT JOIN BookAuthors ba ON a.AuthorID = ba.AuthorID
                WHERE
                    (@searchTerm = '' OR
                    a.FirstName LIKE '%' + @searchTerm + '%' OR
                    a.LastName LIKE '%' + @searchTerm + '%' OR
                    a.Biography LIKE '%' + @searchTerm + '%')
                AND (@country IS NULL OR a.Country = @country)
                GROUP BY a.AuthorID, a.FirstName, a.LastName, a.Biography, a.BirthDate, a.Country
                ORDER BY a.LastName, a.FirstName
                OFFSET @offset ROWS
                FETCH NEXT @pageSize ROWS ONLY;
            `;

            const result = await this.db.query(query, {
                searchTerm,
                country,
                offset,
                pageSize
            });

            return result.recordset.map(row => new Author({
                authorId: row.authorId,
                firstName: row.firstName,
                lastName: row.lastName,
                biography: row.biography,
                birthDate: row.birthDate,
                country: row.country
            }));

        } catch (error) {
            throw new Error(`Failed to find authors by search criteria: ${error.message}`);
        }
    }

    async save(author){
        if(!author instanceof Author){
            throw new Error('Invalid author entity');
        }

        try {
            // if authorId exists, Update; else INSERT
            if(author.authorId){
                const query = `
                    UPDATE Authors
                    SET
                        FirstName = @firstName,
                        LastName = @lastName,
                        Biography = @biography,
                        BirthDate = @birthDate,
                        Country = @country
                    WHERE AuthorID = @authorId;

                    SELECT 
                        a.AuthorID as authorId,
                        a.FirstName as firstName,
                        a.LastName as lastName,
                        a.Biography as biography,
                        a.BirthDate as birthDate,
                        a.Country as country
                    FROM Authors a
                    WHERE a.AuthorID = @authorId;
                `;

                const result = await this.db.query(query, {
                    authorId: author.authorId,
                    firstName: author.firstName,
                    lastName: author.lastName,
                    biography: author.biography,
                    birthDate: author.birthDate,
                    country: author.country
                });

                const row = result.recordset[0];
                return new Author({
                    authorId: row.authorId,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    biography: row.biography,
                    birthDate: row.birthDate,
                    country: row.country
                });
            } else {
                const query = `
                    INSERT INTO Authors (FirstName, LastName, Biography, BirthDate, Country)
                    OUTPUT
                        INSERTED.AuthorID as authorId,
                        INSERTED.FirstName as firstName,
                        INSERTED.LastName as lastName,
                        INSERTED.Biography as biography,
                        INSERTED.BirthDate as birthDate,
                        INSERTED.Country as country
                    VALUES(@firstName, @lastName, @biography, @birthDate, @country);
                `;

                const result = await this.db.query(query, {
                    firstName: author.firstName,
                    lastName: author.lastName,
                    biography: author.biography,
                    birthDate: author.birthDate,
                    country: author.country
                });

                const row = result.recordset[0];
                return new Author({
                    authorId: row.authorId,
                    firstName: row.firstName,
                    lastName: row.lastName,
                    biography: row.biography,
                    birthDate: row.birthDate,
                    country: row.country
                });
            }
        } catch (error) {
            throw new Error(`Failed to save author: ${error.message}`);
        }
    }

    async deleteById(authorId){
        try {
            const query = `
                DELETE FROM Authors
                WHERE AuthorID = @authorId;
            `;

            await this.db.query(query, {authorId});

        } catch (error) {
            throw new Error(`Failed to delete author: ${error.message}`);
        }
    }
}

module.exports = AuthorRepository;