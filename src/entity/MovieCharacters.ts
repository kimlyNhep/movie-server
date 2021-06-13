import { Character } from './Character';
import { Field, ObjectType } from 'type-graphql';
import { MovieInfo } from './MovieInfo';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Movie } from './Movie';

@ObjectType()
@Entity('movie_characters')
export class MovieCharacters {
  @Field(() => Character)
  @JoinColumn({ name: 'characterId' })
  @ManyToOne(() => Character, (character) => character.movieCharacters, {
    primary: true,
  })
  character: Character;

  @Field(() => Movie)
  @JoinColumn({ name: 'movieId' })
  @ManyToOne(() => Movie, (movie) => movie.movieCharacters, { primary: true })
  movie: Movie;

  @Field({ nullable: true })
  @Column({ nullable: true })
  role?: string;
}
