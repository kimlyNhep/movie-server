import { MovieCharacters } from './MovieCharacters';
import { Field, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Character extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  username: string;

  @Field({ nullable: true })
  @Column()
  photo?: string;

  @Field(() => [MovieCharacters], { nullable: true })
  @OneToMany(
    () => MovieCharacters,
    (movieCharacter) => movieCharacter.character,
    { nullable: true }
  )
  movieCharacters?: MovieCharacters[];
}
