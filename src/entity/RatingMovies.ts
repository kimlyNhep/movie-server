import { Field, Int, ObjectType } from 'type-graphql';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Movie } from './Movie';
import { User } from './User';

@ObjectType()
@Entity('rating_movies')
export class RatingMovies {
  @Field(() => User)
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.ratingMovies, { primary: true })
  user: User;

  @Field(() => Movie)
  @JoinColumn({ name: 'movieId' })
  @ManyToOne(() => Movie, (movie) => movie.ratingMovies, { primary: true })
  movie: Movie;

  @Field(() => Int)
  @Column()
  ratedPoint: number;
}
