import { MovieResponse } from './../types/movie';
import { ErrorResponse } from './../types/error';
import { MovieContext } from './../MovieContext';
import { isAuth, isLogged } from './../middleware/auth';
import {
  Arg,
  Ctx,
  InputType,
  Mutation,
  Resolver,
  UseMiddleware,
  Field,
  ObjectType,
  Query,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { User } from '../entity/User';
import { Comment } from '../entity/Comment';
import { Movie } from '../entity/Movie';

@InputType()
class CommentMovieInput {
  @Field()
  id: string;

  @Field()
  comments: string;
}

@ObjectType()
class CommentResponse {
  @Field(() => Comment, { nullable: true })
  comment?: Comment;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
class CommentsResponse {
  @Field(() => [CommentWithPermission], { nullable: true })
  comments?: CommentWithPermission[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
class CommentWithPermission {
  @Field(() => Comment, { nullable: true })
  comment?: Comment;

  @Field(() => Boolean, { defaultValue: false })
  isEdit: boolean;

  @Field(() => Boolean, { defaultValue: false })
  isDelete: boolean;
}

@Resolver()
export class commentResolvers {
  @Query(() => CommentsResponse)
  @UseMiddleware(isLogged)
  async getComments(
    @Arg('movieId') mid: string,
    @Ctx() { payload }: MovieContext
  ): Promise<CommentsResponse> {
    const comments = await getConnection()
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.movieId = :mid', { mid })
      .orderBy('comment.createdAt', 'ASC')
      .getMany();

    const results = comments.map((comment) => {
      if (comment.user.id === payload?.id) {
        return { comment: comment, isEdit: true, isDelete: true };
      }
      return { comment: comment, isEdit: false, isDelete: false };
    });

    return {
      comments: results,
    };
  }

  @Query(() => CommentResponse)
  @UseMiddleware(isAuth)
  async getComment(
    @Ctx() { payload }: MovieContext,
    @Arg('id') id: string
  ): Promise<CommentResponse> {
    const comment = await getConnection()
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      return {
        errors: [
          {
            message: "Comment doesn't exist",
          },
        ],
      };
    } else {
      const user = await User.findOne({ where: { id: payload?.id } });

      if (comment.user.id !== user?.id) {
        return {
          errors: [
            {
              field: 'User',
              message: 'Permission deny',
            },
          ],
        };
      }
    }

    return {
      comment,
    };
  }

  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async updateComment(
    @Ctx() { payload }: MovieContext,
    @Arg('id') id: string,
    @Arg('text') text: string
  ): Promise<CommentResponse> {
    // find comment by id
    const comment = await getConnection()
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      return {
        errors: [
          {
            message: "User doesn't exist",
          },
        ],
      };
    } else {
      const user = await User.findOne({ where: { id: payload?.id } });

      if (!user) {
        return {
          errors: [
            {
              field: 'id',
              message: 'Logged user is not exist',
            },
          ],
        };
      } else {
        if (user.id !== comment.user.id)
          return {
            errors: [
              {
                field: 'user',
                message: 'You cannot modify other reviews',
              },
            ],
          };
      }

      await getConnection()
        .createQueryBuilder()
        .update(Comment)
        .set({ text })
        .where('comment.id = :id', { id })
        .execute();

      return {
        comment,
      };
    }
  }

  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Ctx() { payload }: MovieContext,
    @Arg('id') id: string
  ): Promise<CommentResponse> {
    // find comment by id
    const comment = await getConnection()
      .getRepository(Comment)
      .createQueryBuilder('comment')
      .innerJoinAndSelect('comment.user', 'user')
      .where('comment.id = :id', { id })
      .getOne();

    if (!comment) {
      return {
        errors: [
          {
            message: "User doesn't exist",
          },
        ],
      };
    } else {
      const user = await User.findOne({ where: { id: payload?.id } });

      if (!user) {
        return {
          errors: [
            {
              field: 'id',
              message: 'Logged user is not exist',
            },
          ],
        };
      } else {
        if (user.id !== comment.user.id)
          return {
            errors: [
              {
                field: 'user',
                message: 'You cannot delete other reviews',
              },
            ],
          };
      }

      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where('comment.id = :id', { id })
        .execute();

      return {
        comment,
      };
    }
  }

  @Mutation(() => MovieResponse)
  @UseMiddleware(isAuth)
  async commentMovies(
    @Ctx() { payload }: MovieContext,
    @Arg('options') options: CommentMovieInput
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

    const commentMovie = new Comment();
    commentMovie.user = user;
    commentMovie.movie = movie;
    commentMovie.text = options.comments;

    await getConnection().manager.save(commentMovie);
    return {
      movie,
    };
  }
}
