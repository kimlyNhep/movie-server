import { getEnvHost } from './../utils/helper';
import { MovieCharacters } from './../entity/MovieCharacters';
import { Character } from './../entity/Character';
import { isAuth } from './../middleware/auth';
import { MovieContext } from 'src/MovieContext';
import { Genre } from './../entity/Genre';
import { User } from './../entity/User';
import { Movie } from './../entity/Movie';
import {
  MovieResponse,
  CreateMovieInput,
  MoviesResponse,
  UpdateMovieInput,
  MovieRankingResponse,
} from './../types/movie';
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { validate } from 'class-validator';
import { getRepository, getConnection } from 'typeorm';

@Resolver()
export class movieResolvers {
  @Mutation(() => MovieResponse)
  async updateMovie(
    @Arg('options') options: UpdateMovieInput
  ): Promise<MovieResponse> {
    const movie = await Movie.findOne({ where: { id: options.id } });

    if (!movie) {
      return {
        errors: [
          {
            message: "Movie doesn't exist",
          },
        ],
      };
    }

    const genres = await getRepository(Genre).findByIds(options.genres);

    if (genres.length < options.genres.length)
      return {
        errors: [
          {
            message: "Genre doesn't exist",
          },
        ],
      };

    let characters: Character[] | undefined;
    if (options.characters) {
      characters = await getRepository(Character).findByIds(options.characters);
      if (characters.length < options.characters.length)
        return {
          errors: [
            {
              message: "Character doesn't exist",
            },
          ],
        };
    }

    const characterWithRole = characters?.map((item, index) => {
      if (item.id === options.characters![index].id) {
        return { character: item, role: options.characters![index].role };
      }
      return null;
    });

    movie.title = options.title;
    movie.description = options.description;
    movie.genres = genres;

    const errors = await validate(movie);

    if (errors.length > 0) {
      return {
        errors: errors.map((error) => {
          const { constraints, property } = error;
          const key = Object.keys(constraints!)[0];
          return { field: property, message: constraints![key] };
        }),
      };
    } else {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const newMovie = queryRunner.manager.create(Movie, movie);
        await queryRunner.manager.save(newMovie);

        // delete all relation characters on movie info
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(MovieCharacters)
          .where('movieId = :id', { id: options.id })
          .execute();

        for (const [, value] of Object.entries(characterWithRole!)) {
          const moviesCharacters = new MovieCharacters();
          moviesCharacters.movie = newMovie;
          moviesCharacters.character = value!.character;
          moviesCharacters.role = value!.role;

          const newMoviesCharacters = queryRunner.manager.create(
            MovieCharacters,
            moviesCharacters
          );

          await queryRunner.manager.save(newMoviesCharacters);
        }

        await queryRunner.commitTransaction();
        return {
          movie: newMovie,
        };
      } catch (err) {
        queryRunner.rollbackTransaction();
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

  @Mutation(() => MovieResponse)
  @UseMiddleware(isAuth)
  async createMovie(
    @Ctx() { payload }: MovieContext,
    @Arg('options') options: CreateMovieInput
  ): Promise<MovieResponse> {
    const user = await User.findOne({ where: { id: payload?.id } });

    if (!user) {
      return {
        errors: [
          {
            message: 'User not exist',
          },
        ],
      };
    }

    const genres = await getRepository(Genre).findByIds(options.genres);
    if (genres.length < options.genres.length)
      return {
        errors: [
          {
            message: "Genre doesn't exist",
          },
        ],
      };

    const movie = new Movie();
    movie.title = options.title;
    movie.description = options.description;
    movie.creator = user;
    movie.genres = genres;
    movie.point = 0;
    movie.photo = `${getEnvHost()}/images/default.png`;

    let characters: Character[] | undefined;
    if (options.characters) {
      characters = await getRepository(Character).findByIds(
        options.characters.map((item) => item.id)
      );
      if (characters.length < options.characters.length)
        return {
          errors: [
            {
              message: "Character doesn't exist",
            },
          ],
        };
    }

    const characterWithRole = characters?.map((item, index) => {
      if (item.id === options.characters![index].id) {
        return { character: item, role: options.characters![index].role };
      }
      return null;
    });

    const errors = await validate(movie);
    if (errors.length > 0) {
      return {
        errors: errors.map((error) => {
          const { constraints, property } = error;
          const key = Object.keys(constraints!)[0];
          return { field: property, message: constraints![key] };
        }),
      };
    } else {
      const queryRunner = getConnection().createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        const newMovie = queryRunner.manager.create(Movie, movie);
        await queryRunner.manager.save(newMovie);

        for (const [, value] of Object.entries(characterWithRole!)) {
          const moviesCharacters = new MovieCharacters();
          moviesCharacters.movie = newMovie;
          moviesCharacters.character = value!.character;
          moviesCharacters.role = value!.role;
          const newMoviesCharacters = queryRunner.manager.create(
            MovieCharacters,
            moviesCharacters
          );
          await queryRunner.manager.save(newMoviesCharacters);
        }

        await queryRunner.commitTransaction();

        return {
          movie: newMovie,
        };
      } catch (err) {
        queryRunner.rollbackTransaction();
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
      } finally {
        await queryRunner.release();
      }
    }
  }

  @Query(() => MovieResponse)
  async getMovie(@Arg('id') id: string): Promise<MovieResponse> {
    const movieQuery = await getConnection()
      .createQueryBuilder()
      .select('movie')
      .from(Movie, 'movie')
      .where('movie.id = :id', { id })
      .innerJoinAndSelect('movie.creator', 'creator')
      .innerJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.ratingMovies', 'ratingMovies')
      .leftJoinAndSelect('movie.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'users')
      .leftJoinAndSelect('movie.movieCharacters', 'movieCharacters')
      .leftJoinAndSelect('movieCharacters.character', 'characters')
      .leftJoinAndSelect('ratingMovies.user', 'ratedUsers')
      .leftJoinAndSelect('movie.info', 'info')
      .leftJoinAndSelect('movie.movieState', 'movieState')
      .orderBy('comment.createdAt', 'ASC')
      .getOne();

    if (!movieQuery) {
      return {
        errors: [
          {
            field: 'id',
            message: 'Movie not exist',
          },
        ],
      };
    }

    return {
      movie: movieQuery,
    };
  }

  @Query(() => MoviesResponse)
  async getMovies(): Promise<MoviesResponse> {
    const moviesQuery = await getConnection()
      .createQueryBuilder(Movie, 'movie')
      .innerJoinAndSelect('movie.creator', 'creator')
      .innerJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.ratingMovies', 'ratingMovies')
      .leftJoinAndSelect('movie.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'users')
      .leftJoinAndSelect('movie.movieCharacters', 'movieCharacters')
      .leftJoinAndSelect('movieCharacters.character', 'characters')
      .leftJoinAndSelect('ratingMovies.user', 'ratedUsers')
      .leftJoinAndSelect('movie.info', 'info')
      .getMany();

    return {
      movies: moviesQuery,
    };
  }

  @Query(() => MoviesResponse)
  async getMoviesByYear(@Arg('year') year: number): Promise<MoviesResponse> {
    const moviesQuery = await getConnection()
      .createQueryBuilder()
      .select('movie')
      .from(Movie, 'movie')
      .orderBy('movie.title', 'ASC')
      .innerJoinAndSelect('movie.creator', 'creator')
      .innerJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.info', 'info')
      .where(`info.released_date like '%${year}%'`)
      .leftJoinAndSelect('info.movieCharacters', 'movieCharacters')
      .leftJoinAndSelect('movieCharacters.characters', 'characters')
      .getMany();

    return {
      movies: moviesQuery,
    };
  }

  @Query(() => MovieRankingResponse)
  async getRankingMovies(): Promise<MovieRankingResponse> {
    const moviesQuery = await getConnection()
      .createQueryBuilder(Movie, 'movie')
      .innerJoinAndSelect('movie.creator', 'creator')
      .innerJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.ratingMovies', 'ratingMovies')
      .leftJoinAndSelect('movie.comment', 'comment')
      .leftJoinAndSelect('comment.user', 'users')
      .leftJoinAndSelect('movie.movieCharacters', 'movieCharacters')
      .leftJoinAndSelect('movieCharacters.character', 'characters')
      .leftJoinAndSelect('ratingMovies.user', 'ratedUsers')
      .leftJoinAndSelect('movie.info', 'info')
      .orderBy('movie.point', 'DESC')
      .getMany();

    const movies = moviesQuery.map((item, index) => ({
      rankingMovie: item,
      rank: index + 1,
    }));

    return {
      movies,
    };
  }

  @Query(() => MoviesResponse)
  @UseMiddleware(isAuth)
  async getMoviesByUser(
    @Ctx() { payload }: MovieContext
  ): Promise<MoviesResponse> {
    const movies = await getConnection()
      .createQueryBuilder(Movie, 'movie')
      .where('movie.creatorId = :uid', { uid: payload?.id })
      .getMany();

    return {
      movies,
    };
  }

  @Query(() => MoviesResponse)
  async getTopMovies(): Promise<MoviesResponse> {
    const movies = await getConnection()
      .createQueryBuilder(Movie, 'movie')
      .orderBy('movie.rank', 'ASC')
      .limit(5)
      .getMany();
    return {
      movies,
    };
  }
}
