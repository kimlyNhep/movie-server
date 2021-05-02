import { isAuth, isAdmin } from './../middleware/auth';
import { GenreResponse, GenresResponse } from './../types/genre';
import { Genre } from './../entity/Genre';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { validate } from 'class-validator';
import { getConnection, getManager } from 'typeorm';

@Resolver()
export class genreResolvers {
  @Mutation(() => GenreResponse)
  @UseMiddleware(isAuth, isAdmin)
  async createGenre(@Arg('name') name: string): Promise<GenreResponse> {
    const genre = new Genre();
    genre.name = name;

    const errors = await validate(genre);
    if (errors.length > 0) {
      return {
        errors: errors.map((error) => {
          const { constraints, property } = error;
          const key = Object.keys(constraints!)[0];
          return { field: property, message: constraints![key] };
        }),
      };
    } else {
      try {
        const newGenre = await getManager().save(genre);
        return {
          genre: newGenre,
        };
      } catch (err) {
        const { code } = err;

        if (code === '23505') {
          const start = err.detail.indexOf('(');
          const end = err.detail.indexOf(')');
          return {
            errors: [
              {
                field: err.detail.substring(start + 1, end),
                message: 'Already exist!',
              },
            ],
          };
        }
        return {
          errors: err,
        };
      }
    }
  }

  @Query(() => GenresResponse)
  @UseMiddleware(isAuth)
  async getGenres(): Promise<GenresResponse> {
    const genreQuery = await getConnection()
      .createQueryBuilder()
      .select('genres')
      .from(Genre, 'genres')
      .getMany();

    return {
      genres: genreQuery,
    };
  }
}
