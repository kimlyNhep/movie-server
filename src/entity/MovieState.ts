import { Movie } from './Movie';
import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity()
export class MovieState extends BaseEntity {
  @Field(() => Int)
  @Column()
  watching: number;

  @Field(() => Int)
  @Column()
  planToWatch: number;

  @Field(() => Int)
  @Column()
  completed: number;

  @Field(() => Int)
  @Column()
  drop: number;

  @Field(() => User, { nullable: false })
  @ManyToOne(() => User, (user) => user.movieState, {
    nullable: false,
    primary: true,
  })
  @JoinColumn()
  user: User;

  @Field(() => Movie, { nullable: false })
  @ManyToOne(() => Movie, (movie) => movie.movieState, {
    primary: true,
    nullable: false,
  })
  @JoinColumn()
  movie: Movie;
}
