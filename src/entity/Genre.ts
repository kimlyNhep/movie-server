import { Field, ObjectType } from 'type-graphql';
import { Movie } from './Movie';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Genre extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Movie, (movie) => movie.genres)
  @JoinTable({ name: 'genres_movies' })
  movies?: Movie[];
}