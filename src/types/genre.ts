import { ErrorResponse } from '../types/error'
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class GenreResponse {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
