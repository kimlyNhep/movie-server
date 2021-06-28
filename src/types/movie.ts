import { Movie } from './../entity/Movie';
import { ErrorResponse } from '../types/error';
import { MovieType, StatusType, MovieStateType } from './../enumType';
import {
  Field,
  InputType,
  ObjectType,
  Int,
  registerEnumType,
} from 'type-graphql';
import { Stream } from 'stream';
import { MovieInfo } from '../entity/MovieInfo';

registerEnumType(MovieType, {
  name: 'MovieType',
});

registerEnumType(StatusType, {
  name: 'StatusType',
});

registerEnumType(MovieStateType, {
  name: 'MovieStateType',
});

@ObjectType()
class RankingType {
  @Field(() => Movie)
  rankingMovie: Movie;

  @Field(() => Number)
  rank: number;
}
@ObjectType()
export class MovieRankingResponse {
  @Field(() => [RankingType], { nullable: true })
  movies?: RankingType[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class MovieResponse {
  @Field(() => Movie, { nullable: true })
  movie?: Movie;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class MovieResponseWithPermission {
  @Field(() => Movie, { nullable: true })
  movie?: Movie;

  @Field(() => Boolean, { nullable: true })
  isOwner?: boolean;

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

  @Field(() => [CharacterInput], { nullable: true })
  characters?: CharacterInput[];
}

@InputType()
export class UpdateMovieInput {
  @Field()
  id: string;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => [String])
  genres: string[];

  @Field(() => [CharacterInput], { nullable: true })
  characters?: CharacterInput[];
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
class CharacterInput {
  @Field()
  id: string;

  @Field()
  role: string;
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
  released_date?: String;

  @Field(() => String)
  movie: string;

  @Field(() => String, { nullable: true })
  synopsis?: string;

  @Field(() => String, { nullable: true })
  backgroundInfo?: string;
}

@InputType()
export class UpdateMovieInformationInput {
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
  released_date?: String;

  @Field(() => String)
  movie: string;

  @Field(() => String, { nullable: true })
  synopsis?: string;

  @Field(() => String, { nullable: true })
  backgroundInfo?: string;
}
