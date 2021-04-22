import { MovieType, StatusType } from './../enumType';
import {
  Field,
  InputType,
  ObjectType,
  Int,
  registerEnumType,
} from 'type-graphql';

registerEnumType(MovieType, {
  name: 'MovieType',
});

registerEnumType(StatusType, {
  name: 'StatusType',
});

@ObjectType()
class MovieErrorResponse {
  @Field(() => String, { nullable: true })
  field?: string;

  @Field(() => String, { nullable: true })
  message?: string;
}

@ObjectType()
export class MovieResponse {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [MovieErrorResponse], { nullable: true })
  errors?: MovieErrorResponse[];
}

@InputType()
export class CreateMovieInput {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  photo?: string;

  @Field(() => String)
  creator: string;

  @Field(() => [String])
  genres: string[];
}

@InputType()
export class CreateMovieInformationInput {
  @Field(() => MovieType)
  type: MovieType;

  @Field(() => String, { nullable: true })
  producer?: string;

  @Field(() => Int)
  episode: number;

  @Field(() => StatusType)
  status: StatusType;

  @Field(() => Int)
  duration: number;

  @Field(() => String, { nullable: true })
  released_date?: Date;

  @Field(() => String)
  movie: string;
}
