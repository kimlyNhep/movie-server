import { MovieState } from './MovieState';
import { Movie } from './Movie';
import { UserRoles } from './../enumType';
import { IsEmail, IsEnum } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { RatingMovies } from './RatingMovies';
import { Comment } from './Comment';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field({ nullable: true })
  @IsEmail({}, { message: 'Invalid Email Format!' })
  @Column('text', { nullable: true, unique: true })
  email?: string;

  @Field()
  @Column('text', { nullable: false, unique: true })
  username: string;

  @Field(() => String)
  @IsEnum(UserRoles, { each: true })
  @Column({
    type: 'enum',
    enum: UserRoles,
  })
  role: UserRoles;

  @Column('text')
  password: string;

  @Field(() => [Movie])
  @OneToMany(() => Movie, (movie) => movie.creator)
  movies: Movie[];

  @Field({ nullable: true })
  @Column()
  photo?: string;

  @Field(() => [RatingMovies], { nullable: true })
  @OneToMany(() => RatingMovies, (ratingMovie) => ratingMovie.user, {
    nullable: true,
  })
  ratingMovies?: RatingMovies[];

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.user, {
    nullable: true,
  })
  comment?: Comment[];

  @Field(() => [MovieState], { nullable: true })
  @OneToMany(() => MovieState, (movieState) => movieState.user, {
    nullable: true,
  })
  movieState?: MovieState[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}
