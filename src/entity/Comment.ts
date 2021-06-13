import { Field, ObjectType } from 'type-graphql';
import {
  Column,
  ManyToOne,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Movie } from './Movie';
import { User } from './User';

@ObjectType()
@Entity('comment')
export class Comment {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => User)
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.comment)
  user: User;

  @Field(() => Movie)
  @JoinColumn({ name: 'movieId' })
  @ManyToOne(() => Movie, (movie) => movie.comment)
  movie: Movie;

  @Field({ nullable: true })
  @Column({ nullable: true })
  text: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: string;
}
