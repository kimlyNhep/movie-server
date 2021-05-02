import { Genre } from './../entity/Genre';
import { ErrorResponse } from '../types/error';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class GenresResponse {
  @Field(() => [Genre], { nullable: true })
  genres?: Genre[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class GenreResponse {
  @Field(() => Genre, { nullable: true })
  genre?: Genre;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
