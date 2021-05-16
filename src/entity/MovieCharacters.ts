import { Field, ObjectType } from 'type-graphql';
import { MovieInfo } from './MovieInfo';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './User';

@ObjectType()
@Entity('movie_characters')
export class MovieCharacters {
  @Field(() => User)
  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user.movieCharacters, { primary: true })
  characters: User;

  @Field(() => MovieInfo)
  @JoinColumn({ name: 'movieinfoId' })
  @ManyToOne(() => MovieInfo, (info) => info.movieCharacters, { primary: true })
  movieInfo: MovieInfo;

  @Field({ nullable: true })
  @Column({ nullable: true })
  role?: string;
}
