import { Genre } from './Genre';
import { MovieInfo } from './MovieInfo';
import { ObjectType, Field } from 'type-graphql';
import { User } from './User';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @ManyToMany(() => Genre, (genre) => genre.movies)
  genres: Genre[];
}
