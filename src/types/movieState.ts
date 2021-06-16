import { User } from './../entity/User';
import { Movie } from './../entity/Movie';
import { Field, Int, ObjectType } from 'type-graphql';
import { ErrorResponse } from './error';

@ObjectType()
export class MovieStateResponse {
  @Field(() => Movie, { nullable: true })
  movie?: Movie;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class UserMovieStateResponse {
  @Field(() => Int)
  watching?: number;

  @Field(() => Int)
  completed?: number;

  @Field(() => Int)
  planToWatch?: number;

  @Field(() => Int)
  drop?: number;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
