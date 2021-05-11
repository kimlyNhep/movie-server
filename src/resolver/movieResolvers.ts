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
import { UsersResponse } from '../types/user';
import { UserRoles } from '../enumType';

interface IToken {
  id?: string;
}
@Resolver()
export class movieResolvers {
  @Mutation(() => MovieInfoResponse)
  async updateMovieInfo(
    @Arg('options') options: UpdateMovieInformationInput
  ): Promise<MovieInfoResponse> {
    const info = await MovieInfo.findOne({ where: { id: options.id } });

    if (!info) {
      return {
        errors: [
          {
            message: "Movie Information doesn't exist",
          },
        ],
      };
    }

    const movie = await Movie.findOne({ where: { id: options.movie } });

    if (!movie) {
      return {
        errors: [
          {
            message: "Movie doesn't exist",
          },
        ],
      };
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

    info.type = options.type;
    info.producer = options.producer;
    info.episode = options.episode;
    info.status = options.status;
    info.duration = options.durations;
    info.released_date = options.released_date;
    info.movie = movie;
    info.characters = characters;
    info.synopsis = options.synopsis;
    info.backgroundInfo = options.backgroundInfo;

    try {
      await getConnection().manager.save(info);
      return {
        info,
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

    const movieInfo = new MovieInfo();
    movieInfo.type = options.type;
    movieInfo.producer = options.producer;
    movieInfo.episode = options.episode;
    movieInfo.duration = options.durations;
    movieInfo.status = options.status;
    movieInfo.released_date = options.released_date;
    movieInfo.synopsis = options.synopsis;
    movieInfo.backgroundInfo = options.backgroundInfo;
    movieInfo.movie = movie;
    movieInfo.characters = characters;

    try {
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
        await getRepository(MovieInfo).save(movieInfo);
        return {
          info: movieInfo,
        };
      }
    } catch (err) {
      console.log(err);
      return {
        errors: [
          {
            message: 'fail',
          },
        ],
      };
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
      .leftJoinAndSelect('movie.info', 'info')
      .innerJoinAndSelect('info.characters', 'characters')
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
      .innerJoinAndSelect('info.characters', 'characters')
      .getMany();

    return {
      movies: moviesQuery,
    };
  }

  @Mutation(() => UsersResponse)
  async addCharacters(
    @Arg('id') id: string,
    @Arg('characterIds', () => [String]) characterIds: string[]
  ): Promise<UsersResponse> {
    const movieInfo = await MovieInfo.findOne({ where: { id } });

    if (!movieInfo) {
      return {
        errors: [
          {
            field: 'id',
            message: "Movie doesn't exist",
          },
        ],
      };
    }

    const characters = await getRepository(User).findByIds(characterIds, {
      where: { role: UserRoles.CHARACTER },
    });

    if (characters.length < characterIds.length)
      return {
        errors: [
          {
            message: "Character donesn't exist",
          },
        ],
      };

    movieInfo.characters = characters;

    await getConnection().manager.save(movieInfo);

    return {
      users: characters,
    };
  }
}
