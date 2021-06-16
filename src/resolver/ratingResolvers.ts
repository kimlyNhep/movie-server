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

    const movie = await getConnection()
      .getRepository(Movie)
      .findOne({ where: { id: option.movieId } });

    if (!movie) {
      return {
        errors: [
          {
            message: "Movie doesn't exist",
          },
        ],
      };
    }

    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(RatingMovies)
      .where('userId = :uid', { uid: user.id })
      .andWhere('movieId = :mid', { mid: movie.id })
      .execute();

    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const newMovie = queryRunner.manager.create(Movie, movie);

      const newRatingMovies = new RatingMovies();
      newRatingMovies.movie = movie;
      newRatingMovies.user = user;
      newRatingMovies.ratedPoint = option.ratedPoint;

      await queryRunner.manager.save(newRatingMovies);

      const ratingMovies = await queryRunner.manager.find(RatingMovies, {
        where: { movie },
      });

      const totalRatedPoint = ratingMovies?.reduce((totalPoint, point) => {
        return totalPoint + point.ratedPoint;
      }, 0);

      newMovie.point = Number(totalRatedPoint);

      await queryRunner.manager.save(newMovie);

      await queryRunner.commitTransaction();

      return {
        movie,
      };
    } catch (err) {
      console.log(err);

      await queryRunner.rollbackTransaction();

      return {
        errors: [
          {
            message: 'fail',
          },
        ],
      };
    }
  }
}
