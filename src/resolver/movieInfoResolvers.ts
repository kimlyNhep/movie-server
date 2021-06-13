import { isAuth } from './../middleware/auth';
import { MovieInfo } from './../entity/MovieInfo';
import { getConnection, getRepository } from 'typeorm';
import {
  MovieInfoResponse,
  UpdateMovieInformationInput,
  CreateMovieInformationInput,
} from './../types/movie';
import { Mutation, Resolver, Arg, UseMiddleware } from 'type-graphql';
import { Character } from '../entity/Character';
import { Movie } from '../entity/Movie';
import { MovieCharacters } from '../entity/MovieCharacters';
import { validate } from 'class-validator';

@Resolver()
export class movieInfoResolvers {
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

    try {
      info.type = options.type;
      info.producer = options.producer;
      info.episode = options.episode;
      info.duration = options.durations;
      info.status = options.status;
      info.released_date = options.released_date;
      info.synopsis = options.synopsis;
      info.backgroundInfo = options.backgroundInfo;

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
        await getConnection().manager.save(info);

        return {
          info,
        };
      }
    } catch (err) {
      return {
        errors: [
          {
            message: 'fail',
          },
        ],
      };
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
}
