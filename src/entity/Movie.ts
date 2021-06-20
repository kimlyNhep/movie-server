import { MovieState } from './MovieState';
import { Comment } from './Comment';
import { Genre } from './Genre';
import { MovieInfo } from './MovieInfo';
import { ObjectType, Field, Int } from 'type-graphql';
import { User } from './User';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RatingMovies } from './RatingMovies';
import { MovieCharacters } from './MovieCharacters';

@ObjectType()
@Entity()
export class Movie extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  photo?: string;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.movies, {
    cascade: true,
    nullable: false,
  })
  creator: User;

  @Field(() => MovieInfo, { nullable: true })
  @OneToOne(() => MovieInfo, (info) => info.movie)
  info?: MovieInfo;

  @Field(() => [Genre])
  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: Genre[];

  @Field(() => [RatingMovies], { nullable: true })
  @OneToMany(() => RatingMovies, (ratingMovie) => ratingMovie.movie, {
    nullable: true,
  })
  ratingMovies?: RatingMovies[];

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.movie, {
    nullable: true,
  })
  comment?: Comment[];

  @Field(() => [MovieCharacters], { nullable: true })
  @OneToMany(() => MovieCharacters, (movieCharacter) => movieCharacter.movie, {
    nullable: true,
  })
  movieCharacters?: MovieCharacters[];

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true, type: 'float' })
  point?: number;

  @Field(() => [MovieState], { nullable: true })
  @OneToMany(() => MovieState, (movieState) => movieState.movie, {
    nullable: true,
  })
  movieState?: MovieState[];

  @Field(() => Int, { defaultValue: 0 })
  @Column({ default: 0 })
  rank: number;
}
