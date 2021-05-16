import { Movie } from '../entity/Movie';
import { getConnection } from 'typeorm';
import { RatingMovies } from '../entity/RatingMovies';
import { decode } from 'jsonwebtoken';
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

interface IToken {
  id?: string;
}

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
    @Ctx() { req }: MovieContext,
    @Arg('option') option: RatingInput
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

    const ratingMovies = await getConnection()
      .createQueryBuilder()
      .from(RatingMovies, 'ratingMovies')
      .where('userId = :uid', { uid: user.id })
      .andWhere('movieId = :mid', { mid: movie.id });

    if (ratingMovies) {
      // delete old rating
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(RatingMovies)
        .where('userId = :uid', { uid: user.id })
        .andWhere('movieId = :mid', { mid: movie.id })
        .execute();
    }

    const newRatingMovies = new RatingMovies();
    newRatingMovies.movie = movie;
    newRatingMovies.user = user;
    newRatingMovies.ratedPoint = option.ratedPoint;

    try {
      await getConnection().manager.save(newRatingMovies);

      return {
        movie,
      };
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
}
