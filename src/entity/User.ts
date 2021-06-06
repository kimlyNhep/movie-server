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
} from 'typeorm';
import { MovieCharacters } from './MovieCharacters';
import { RatingMovies } from './RatingMovies';

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

  @Field(() => [MovieCharacters], { nullable: true })
  @OneToMany(
    () => MovieCharacters,
    (movieCharacter) => movieCharacter.characters,
    {
      nullable: true,
    }
  )
  movieCharacters?: MovieCharacters[];

  @Field(() => [RatingMovies], { nullable: true })
  @OneToMany(() => RatingMovies, (ratingMovie) => ratingMovie.user, {
    nullable: true,
  })
  ratingMovies?: RatingMovies[];
}
