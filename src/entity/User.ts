import { Movie } from './Movie';
import { UserRoles } from './../enumType';
import { IsEmail, IsEnum } from 'class-validator';
import { Field, Int, ObjectType } from 'type-graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn('uuid')
  id: number;

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
}
