import { ErrorResponse } from "../types/error";
import { MovieType, StatusType } from "./../enumType";
import {
  Field,
  InputType,
  ObjectType,
  Int,
  registerEnumType,
} from "type-graphql";

registerEnumType(MovieType, {
  name: "MovieType",
});

registerEnumType(StatusType, {
  name: "StatusType",
});
@ObjectType()
export class MovieResponse {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@InputType()
export class CreateMovieInput {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  photo?: string;

  @Field(() => [String])
  genres: string[];
}

@InputType()
export class CreateMovieInformationInput {
  @Field(() => MovieType)
  type: MovieType;

  @Field(() => String, { nullable: true })
  producer?: string;

  @Field(() => Int, { nullable: true })
  episode?: number;

  @Field(() => StatusType)
  status: StatusType;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => String, { nullable: true })
  released_date?: Date;

  @Field(() => String)
  movie: string;
}
