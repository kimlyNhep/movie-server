import { ErrorResponse } from '../types/error';
import { MovieType, StatusType } from './../enumType';
import {
  Field,
  InputType,
  ObjectType,
  Int,
  registerEnumType,
} from 'type-graphql';
import { Stream } from 'stream';
import { Movie } from '../entity/Movie';
import { MovieInfo } from '../entity/MovieInfo';

registerEnumType(MovieType, {
  name: 'MovieType',
});

registerEnumType(StatusType, {
  name: 'StatusType',
});
@ObjectType()
export class MovieResponse {
  @Field(() => Movie, { nullable: true })
  movie?: Movie;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class MoviesResponse {
  @Field(() => [Movie], { nullable: true })
  movies?: Movie[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class MovieInfoResponse {
  @Field(() => MovieInfo, { nullable: true })
  info?: MovieInfo;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@InputType()
export class CreateMovieInput {
  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String])
  genres: string[];
}

@InputType()
export class UploadInput {
  @Field()
  filename: string;

  @Field()
  mimeType: string;

  @Field()
  encoding: string;

  @Field(() => Stream)
  createReadStream: () => Stream;
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
  durations?: number;

  @Field(() => String, { nullable: true })
  released_date?: Date;

  @Field(() => String)
  movie: string;
}
