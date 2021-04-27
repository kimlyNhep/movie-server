import { isAuth } from "./../middleware/auth";
import { GenreResponse } from "./../types/genre";
import { Genre } from "./../entity/Genre";
import { Arg, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { validate } from "class-validator";
import { getConnection, getManager } from "typeorm";

@Resolver()
export class genreResolvers {
  @Mutation(() => GenreResponse)
  @UseMiddleware(isAuth)
  async createGenre(@Arg("name") name: string): Promise<GenreResponse> {
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
        message: "success",
      };
    }
  }

  @Query(() => GenreResponse)
  @UseMiddleware(isAuth)
  async getGenres(): Promise<GenreResponse> {
    const genreQuery = await getConnection()
      .createQueryBuilder()
      .select("genres")
      .from(Genre, "genres")
      .getMany();

    return {
      genres: genreQuery,
    };
  }
}
