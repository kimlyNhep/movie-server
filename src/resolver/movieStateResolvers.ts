import { MovieStateResponse, UserMovieStateResponse } from './../types/movieState';
import { MovieStateType } from './../enumType';
import { getConnection } from 'typeorm';
import { MovieState } from './../entity/MovieState';
import { MovieContext } from './../MovieContext';
import { isAuth } from './../middleware/auth';
import { User } from './../entity/User';
import { Movie } from './../entity/Movie';
import { Mutation, Resolver, UseMiddleware, Arg, Ctx, Query } from 'type-graphql';

@Resolver()
export class movieStateResolvers {
  @Query(() => UserMovieStateResponse)
  @UseMiddleware(isAuth)
  async getCurrentMovieState(
    @Ctx() { payload }: MovieContext,
    @Arg('mid') mid: string
  ): Promise<UserMovieStateResponse> {
    const movieStates = await getConnection()
      .createQueryBuilder(MovieState, 'movieState')
      .where('movieState.userId = :uid', { uid: payload?.id })
      .andWhere('movieState.movieId = :mid', { mid })
      .getOne();

    return {
      watching: movieStates?.watching,
      completed: movieStates?.completed,
      planToWatch: movieStates?.planToWatch,
      drop: movieStates?.drop,
    };
  }

  @Query(() => UserMovieStateResponse)
  @UseMiddleware(isAuth)
  async getMovieState(@Ctx() { payload }: MovieContext): Promise<UserMovieStateResponse> {
    const movieStates = await getConnection()
      .createQueryBuilder(MovieState, 'movieState')
      .where('movieState.userId = :uid', { uid: payload?.id })
      .getMany();

    const movieStateResult = movieStates.reduce(
      (state, item) => {
        const watching = state.watching + item.watching;
        const completed = state.completed + item.completed;
        const planToWatch = state.planToWatch + item.planToWatch;
        const drop = state.drop + item.drop;

        state = { watching, completed, planToWatch, drop };

        return state;
      },
      {
        watching: 0,
        completed: 0,
        planToWatch: 0,
        drop: 0,
      }
    );

    return {
      watching: movieStateResult.watching,
      completed: movieStateResult.completed,
      planToWatch: movieStateResult.planToWatch,
      drop: movieStateResult.drop,
    };
  }

  @Mutation(() => MovieStateResponse)
  @UseMiddleware(isAuth)
  async updateMovieState(
    @Arg('mid') mid: string,
    @Arg('options') options: MovieStateType,
    @Ctx() { payload }: MovieContext
  ): Promise<MovieStateResponse> {
    const movie = await Movie.findOne({ where: { id: mid } });
    if (!movie) {
      return {
        errors: [
          {
            message: "Movie doesn't exist",
          },
        ],
      };
    }

    const user = await User.findOne({ where: { id: payload?.id } });

    if (!user) {
      return {
        errors: [
          {
            message: "User doesn't exist",
          },
        ],
      };
    }

    try {
      let movieState = await getConnection()
        .createQueryBuilder(MovieState, 'movieState')
        .where('movieState.userId = :uid', { uid: payload?.id })
        .andWhere('movieState.movieId = :mid', { mid })
        .getOne();

      if (!movieState) {
        movieState = new MovieState();
      }

      movieState.watching = 0;
      movieState.planToWatch = 0;
      movieState.completed = 0;
      movieState.drop = 0;

      switch (options) {
        case MovieStateType.Watching:
          movieState.watching = 1;
          break;
        case MovieStateType.Completed:
          movieState.completed = 1;
          break;
        case MovieStateType.Plantowatch:
          movieState.planToWatch = 1;
          break;
        case MovieStateType.Drop:
          movieState.drop = 1;
          break;
      }

      movieState.user = user;
      movieState.movie = movie;

      await getConnection().manager.save(movieState);

      return {
        movie,
        user,
      };
    } catch (err) {
      return {
        errors: [
          {
            message: 'Something went wrong',
          },
        ],
      };
    }
  }
}
