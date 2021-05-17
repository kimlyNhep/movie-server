import { getManager } from 'typeorm';
import { ErrorResponse } from '../types/error';
import { ObjectType } from 'type-graphql';
import { Movie } from './../entity/Movie';
import { Field } from 'type-graphql';
import { FileUpload } from 'graphql-upload';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { createWriteStream } from 'fs';

@ObjectType()
class MovieUploadResponse {
  @Field({ nullable: true })
  imageUrl?: string;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@Resolver()
export class uploadResolver {
  @Mutation(() => MovieUploadResponse)
  async uploadMoviePhoto(
    @Arg('id') id: string,
    @Arg('photo', () => GraphQLUpload) photo: FileUpload
  ): Promise<MovieUploadResponse> {
    // const id = option.id;

    const movie = await Movie.findOne({ where: { id } });
    if (!movie) {
      return {
        errors: [
          {
            field: 'id',
            message: "Movie doesn't exist",
          },
        ],
      };
    }

    const { createReadStream, filename } = photo;
    createReadStream().pipe(
      createWriteStream(__dirname + `/../../public/images/${filename}`)
    );

    // add photo url to database
    movie.photo = `http://localhost:8000/images/${filename}`;

    try {
      await getManager().save(movie);
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

    return {
      imageUrl: `http://localhost:8000/images/${filename}`,
    };
  }
}
