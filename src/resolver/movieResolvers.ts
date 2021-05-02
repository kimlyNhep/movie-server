import { createWriteStream } from 'fs';
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
import { getManager, getRepository, getConnection } from 'typeorm';
import { decode } from 'jsonwebtoken';

interface IToken {
  id?: string;
}
@Resolver()
export class movieResolvers {
  @Query(() => User, { nullable: true })
  async test(@Ctx() { req }: MovieContext): Promise<User | undefined> {
    const { token } = req.cookies;
    const { id } = <IToken>decode(token);
    const user = await User.findOne({ where: { id } });
    return user;
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
            message: 'Genre not exist',
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
        await getManager().save(movie);
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

    const movieInfo = new MovieInfo();
    movieInfo.type = options.type;
    movieInfo.producer = options.producer;
    movieInfo.episode = options.episode;
    movieInfo.duration = options.durations;
    movieInfo.status = options.status;
    movieInfo.released_date = options.released_date;
    movieInfo.movie = movie;

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

  @Mutation(() => MovieResponse)
  async getMovie(@Arg('id') id: string): Promise<MovieResponse> {
    const movieQuery = await getConnection()
      .createQueryBuilder()
      .select('movie')
      .from(Movie, 'movie')
      .where('movie.id = :id', { id })
      .innerJoinAndSelect('movie.creator', 'creator')
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
}
