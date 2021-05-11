import { Movie } from './Movie';
import { MovieType, StatusType } from './../enumType';
import { IsEnum } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class MovieInfo extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @IsEnum(MovieType, { each: true, message: 'Invalid Movie Type!' })
  @Column({
    type: 'enum',
    enum: MovieType,
    nullable: false,
  })
  type: MovieType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  producer?: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  episode?: number;

  @Field(() => String)
  @IsEnum(StatusType, { each: true, message: 'Invalid Status Type!' })
  @Column({
    type: 'enum',
    enum: StatusType,
    nullable: false,
  })
  status: StatusType;

  @Field({ nullable: true })
  @Column({ nullable: true })
  synopsis?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  backgroundInfo?: string;

  @Field(() => Number, { nullable: true })
  @Column({ nullable: true })
  duration?: number;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  released_date?: String;

  @Field(() => Movie)
  @OneToOne(() => Movie)
  @JoinColumn()
  movie: Movie;

  @Field(() => [User], { nullable: true })
  @ManyToMany(() => User, (character) => character.actingMovies, {
    nullable: true,
  })
  characters?: User[];
}
