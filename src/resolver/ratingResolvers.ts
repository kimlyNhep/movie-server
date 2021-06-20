import { Movie } from '../entity/Movie';
import { getConnection } from 'typeorm';
import { RatingMovies } from '../entity/RatingMovies';
import { User } from '../entity/User';
import { isAuth } from '../middleware/auth';
import { MovieContext } from '../MovieContext';
import { MovieResponse } from '../types/movie';
import {
  Mutation,
  Resolver,
  UseMiddleware,
  InputType,
  Field,
  Ctx,
  Int,
  Arg,
} from 'type-graphql';

@InputType()
export class RatingInput {
  @Field(() => Int)
  ratedPoint: number;

  @Field()
  movieId: string;
}

@Resolver()
export class ratingResolvers {
  @Mutation(() => MovieResponse)
  @UseMiddleware(isAuth)
  async ratingMovie(
    @Ctx() { payload }: MovieContext,
    @Arg('option') option: RatingInput
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

    const movie = await Movie.findOne({ where: { id: option.movieId } });

    if (!movie) {
      return {
        errors: [
          {
            message: "Movie doesn't exist",
          },
        ],
      };
    }

    let existingRatingMovie = await getConnection()
      .createQueryBuilder(RatingMovies, 'ratingMovie')
      .where('ratingMovie.userId = :uid', { uid: user.id })
      .andWhere('ratingMovie.movieId = :mid', { mid: movie.id })
      .getOne();

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();

    await queryRunner.startTransaction();

    try {
      const newMovie = queryRunner.manager.create(Movie, movie);

      if (!existingRatingMovie) {
        existingRatingMovie = new RatingMovies();
      }

      existingRatingMovie.movie = movie;
      existingRatingMovie.user = user;
      existingRatingMovie.ratedPoint = option.ratedPoint;

      await queryRunner.manager.save(existingRatingMovie);

      // calculate all point by movie
      const ratingMovies = await queryRunner.manager.find(RatingMovies, {
        where: { movie },
      });

      const totalRatedPoint = ratingMovies?.reduce((totalPoint, point) => {
        return totalPoint + point.ratedPoint;
      }, 0);

      console.log('Total Rated Point : ', totalRatedPoint);

      newMovie.point = Number(totalRatedPoint);

      await queryRunner.manager.save(newMovie);

      // calculate rank

      const movies = await queryRunner.manager.find(Movie, {
        order: { point: 'DESC' },
      });

      movies.forEach(async (m, index) => {
        const rankMovie = queryRunner.manager.create(Movie, m);
        rankMovie.rank = index + 1;
        await queryRunner.manager.save(rankMovie);
      });

      let index = 0;
      for (const [, value] of Object.entries(movies)) {
        const rankMovie = queryRunner.manager.create(Movie, value);
        rankMovie.rank = index + 1;
        index++;
        await queryRunner.manager.save(rankMovie);
      }

      await queryRunner.commitTransaction();

      return {
        movie: newMovie,
      };
    } catch (err) {
      console.log(err);

      await queryRunner.rollbackTransaction();

      return {
        errors: [
          {
            message: 'something went wrong!',
          },
        ],
      };
    } finally {
      // you need to release query runner which is manually created:
      await queryRunner.release();
    }
  }
}
