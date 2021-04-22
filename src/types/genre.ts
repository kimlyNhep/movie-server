import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class GenreErrorResponse {
  @Field()
  field?: string;

  @Field()
  message?: string;
}

@ObjectType()
export class GenreResponse {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [GenreErrorResponse], { nullable: true })
  errors?: GenreErrorResponse[];
}
