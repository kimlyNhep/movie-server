import { Movie } from './Movie';
import { MovieType, StatusType } from './../enumType';
import { IsEnum } from 'class-validator';
import { ObjectType, Field, Int } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class MovieInfo extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
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

  @Field(() => StatusType)
  @IsEnum(StatusType, { each: true, message: 'Invalid Status Type!' })
  @Column({
    type: 'enum',
    enum: StatusType,
    nullable: false,
  })
  status: StatusType;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  duration?: number;

  @Field(() => String, { nullable: true })
  @Column()
  released_date?: Date;

  @Field(() => Movie)
  @OneToOne(() => Movie)
  @JoinColumn()
  movie: Movie;
}
