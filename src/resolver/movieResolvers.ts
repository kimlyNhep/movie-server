import { MovieInfo } from './../entity/MovieInfo';
import { Genre } from './../entity/Genre';
import { User } from './../entity/User';
import { Movie } from './../entity/Movie';
import {
  MovieResponse,
  CreateMovieInput,
  CreateMovieInformationInput,
} from './../types/movie';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { validate } from 'class-validator';
import { getManager, getRepository } from 'typeorm';

@Resolver()
export class movieResolvers {
  @Mutation(() => MovieResponse)
  async createMovie(
    @Arg('options') options: CreateMovieInput
  ): Promise<MovieResponse> {
    const user = await User.findOne({ where: { id: options.creator } });

    if (!user) {
      return {
        message: 'fail',
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
        message: 'fail',
        errors: [
          {
            message: 'Genre not exist',
          },
        ],
      };

    const movie = new Movie();
    movie.title = options.title;
    movie.description = options.description;
    movie.photo = options.photo;
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
      await getManager().save(movie);
      return {
        message: 'success',
      };
    }
  }

  @Mutation(() => MovieResponse)
  async createMovieInformation(
    @Arg('options') options: CreateMovieInformationInput
  ): Promise<MovieResponse> {
    const movie = await Movie.findOne({ where: { id: options.movie } });

    if (!movie) {
      return {
        message: 'fail',
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
    movieInfo.duration = options.duration;
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
          message: 'success',
        };
      }
    } catch (err) {
      console.log(err);
      return {
        message: 'fail',
      };
    }
  }
}
