import { GenreResponse } from './../types/genre';
import { Genre } from './../entity/Genre';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { validate } from 'class-validator';
import { getManager } from 'typeorm';

@Resolver()
export class genreResolvers {
  @Mutation(() => GenreResponse)
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
      await getManager().save(genre);
      return {
        message: 'success',
      };
    }
  }
}
