import { MovieCharacters } from '../entity/MovieCharacters';
import { isAuth } from './../middleware/auth';
import { MovieContext } from 'src/MovieContext';
import { MovieInfo } from './../entity/MovieInfo';
import { Genre } from './../entity/Genre';
import { User } from './../entity/User';
import { Movie } from './../entity/Movie';
import {
  MovieResponse,
  CreateMovieInput,
  CreateMovieInformationInput,
  MovieInfoResponse,
  MoviesResponse,
  UpdateMovieInput,
  UpdateMovieInformationInput,
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
import { decode } from 'jsonwebtoken';

interface IToken {
  id?: string;
}
@Resolver()
export class movieResolvers {
  @Mutation(() => MovieInfoResponse)
  async updateMovieInfo(
    @Arg('options') options: UpdateMovieInformationInput
  ): Promise<MovieInfoResponse> {
    let info = await getConnection()
      .createQueryBuilder()
      .select('info')
      .from(MovieInfo, 'info')
      .where('info.movie = :id', { id: options.movie })
      .getOne();

    if (!info) {
      const movie = await Movie.findOne({ where: { id: options.movie } });
      if (!movie) {
        return {
          errors: [
            {
              field: 'id',
              message: "Movie doesn't exist",
            },
          ],
        };
      }

      info = new MovieInfo();
      info.movie = movie;
    }

    let characters: User[] | undefined;
    if (options.characters) {
      characters = await getRepository(User).findByIds(options.characters);
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

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      info.type = options.type;
      info.producer = options.producer;
      info.episode = options.episode;
      info.duration = options.durations;
      info.status = options.status;
      info.released_date = options.released_date;
      info.synopsis = options.synopsis;
      info.backgroundInfo = options.backgroundInfo;

      const newMovieInfo = queryRunner.manager.create(MovieInfo, info);
      await queryRunner.manager.update(MovieInfo, info.id, info);
      const errors = await validate(info);

      if (errors.length > 0) {
        return {
          errors: errors.map((error) => {
            const { constraints, property } = error;
            const key = Object.keys(constraints!)[0];
            return { field: property, message: constraints![key] };
          }),
        };
      } else {
        // delete all relation characters on movie info
        await getConnection()
          .createQueryBuilder()
          .delete()
          .from(MovieCharacters)
          .where('movieinfoId = :id', { id: info.id })
          .execute();

        for (const [, value] of Object.entries(characterWithRole!)) {
          const moviesCharacters = new MovieCharacters();
          moviesCharacters.movieInfo = newMovieInfo;
          moviesCharacters.characters = value!.character;
          moviesCharacters.role = value!.role;

          const newMoviesCharacters = queryRunner.manager.create(
            MovieCharacters,
            moviesCharacters
          );

          await queryRunner.manager.save(newMoviesCharacters);
        }

        await queryRunner.commitTransaction();

        return {
          info,
        };
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return {
        errors: [
          {
            message: 'fail',
          },
        ],
      };
    } finally {
    }
  }

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
      try {
        await getConnection().manager.save(movie);
        return {
          movie,
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

  @Mutation(() => MovieResponse)
  @UseMiddleware(isAuth)
  async createMovie(
    @Ctx() { req }: MovieContext,
    @Arg('options') options: CreateMovieInput
  ): Promise<MovieResponse> {
    const { token } = req.cookies;
    const { id } = <IToken>decode(token);
    const user = await User.findOne({ where: { id } });

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
      try {
        await getConnection().manager.save(movie);
        return {
          movie,
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

  @Mutation(() => MovieInfoResponse)
  @UseMiddleware(isAuth)
  async createMovieInformation(
    @Arg('options') options: CreateMovieInformationInput
  ): Promise<MovieInfoResponse> {
    const movie = await Movie.findOne({ where: { id: options.movie } });

    if (!movie) {
      return {
        errors: [
          {
            message: 'Movie not exist',
          },
        ],
      };
    }

    let characters: User[] | undefined;
    if (options.characters) {
      characters = await getRepository(User).findByIds(
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

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let movieInfo = new MovieInfo();
      movieInfo.type = options.type;
      movieInfo.producer = options.producer;
      movieInfo.episode = options.episode;
      movieInfo.duration = options.durations;
      movieInfo.status = options.status;
      movieInfo.released_date = options.released_date;
      movieInfo.synopsis = options.synopsis;
      movieInfo.backgroundInfo = options.backgroundInfo;
      movieInfo.movie = movie;
      const newMovieInfo = queryRunner.manager.create(MovieInfo, movieInfo);
      await queryRunner.manager.save(newMovieInfo);
      const errors = await validate(movieInfo);

      if (errors.length > 0) {
        return {
          errors: errors.map((error) => {
            const { constraints, property } = error;
            const key = Object.keys(constraints!)[0];
            return { field: property, message: constraints![key] };
          }),
        };
      } else {
        for (const [, value] of Object.entries(characterWithRole!)) {
          const moviesCharacters = new MovieCharacters();
          moviesCharacters.movieInfo = newMovieInfo;
          moviesCharacters.characters = value!.character;
          moviesCharacters.role = value!.role;
          const newMoviesCharacters = queryRunner.manager.create(
            MovieCharacters,
            moviesCharacters
          );
          await queryRunner.manager.save(newMoviesCharacters);
        }

        await queryRunner.commitTransaction();

        return {
          info: newMovieInfo,
        };
      }
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return {
        errors: [
          {
            message: 'fail',
          },
        ],
      };
    } finally {
      await queryRunner.release();
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
      .leftJoinAndSelect('ratingMovies.user', 'ratedUsers')
      .leftJoinAndSelect('movie.info', 'info')
      .leftJoinAndSelect('info.movieCharacters', 'movieCharacters')
      .leftJoinAndSelect('movieCharacters.characters', 'characters')
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
      .createQueryBuilder()
      .select('movie')
      .from(Movie, 'movie')
      .innerJoinAndSelect('movie.creator', 'creator')
      .innerJoinAndSelect('movie.genres', 'genres')
      .leftJoinAndSelect('movie.info', 'info')
      .orderBy('info.released_date', 'ASC')
      .leftJoinAndSelect('info.movieCharacters', 'movieCharacters')
      .leftJoinAndSelect('movieCharacters.characters', 'characters')
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
}
