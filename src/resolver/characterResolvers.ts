import { ErrorResponse } from './../types/error';
import { validate } from 'class-validator';
import { getEnvHost } from './../utils/helper';
import { Character } from './../entity/Character';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import {
  Mutation,
  Resolver,
  Arg,
  ObjectType,
  Field,
  Query,
} from 'type-graphql';
import { createWriteStream } from 'fs';
import { getConnection, getManager } from 'typeorm';

@ObjectType()
export class CharacterResponse {
  @Field(() => Character, { nullable: true })
  character?: Character;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class CharactersResponse {
  @Field(() => [Character], { nullable: true })
  characters?: Character[];

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@Resolver()
export class characterResolvers {
  @Mutation(() => CharacterResponse)
  async createCharacter(
    @Arg('username') username: string,
    @Arg('photo', () => GraphQLUpload) photo: FileUpload
  ): Promise<CharacterResponse> {
    try {
      const { createReadStream, filename } = photo;
      createReadStream().pipe(
        createWriteStream(__dirname + `/../../public/profile/${filename}`)
      );

      const character = new Character();

      character.username = username;
      character.photo = `${getEnvHost()}/profile/${filename}`;

      const errors = await validate(character);
      if (errors.length > 0) {
        return {
          errors: errors.map((error) => {
            const { constraints, property } = error;
            const key = Object.keys(constraints!)[0];
            return { field: property, message: constraints![key] };
          }),
        };
      } else {
        await getManager().save(character);
        return {
          character,
        };
      }
    } catch (err) {
      const { code } = err;

      if (code === '23505') {
        const start = err.detail.indexOf('(');
        const end = err.detail.indexOf(')');
        return {
          errors: [
            {
              field: err.detail.substring(start + 1, end),
              message: 'Already exist!',
            },
          ],
        };
      }
      return {
        errors: err,
      };
    }
  }

  @Query(() => CharactersResponse)
  async getAllCharacter(): Promise<CharactersResponse> {
    const characters = await getConnection()
      .createQueryBuilder()
      .select('character')
      .from(Character, 'character')
      .leftJoinAndSelect('character.movieCharacters', 'movieCharacters')
      .leftJoinAndSelect('movieCharacters.movie', 'movies')
      .getMany();

    if (!characters) {
      return {
        errors: [
          {
            message: "Character doesn't exist",
          },
        ],
      };
    }

    return {
      characters,
    };
  }
}
