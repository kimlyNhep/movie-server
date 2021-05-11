import { Movie } from './Movie';
import { MovieInfo } from './MovieInfo';
import { UserRoles } from './../enumType';
import { IsEmail, IsEnum } from 'class-validator';
import { Field, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @IsEmail({}, { message: 'Invalid Email Format!' })
  @Column('text', { nullable: false, unique: true })
  email: string;

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

  @Field(() => [MovieInfo], { nullable: true })
  @ManyToMany(() => MovieInfo, (info) => info.characters, { nullable: true })
  @JoinTable({ name: 'movies_characters' })
  actingMovies?: Movie[];
}
