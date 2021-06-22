import { getManager } from 'typeorm';
import { ErrorResponse } from '../types/error';
import { ObjectType } from 'type-graphql';
import { Movie } from './../entity/Movie';
import { Field } from 'type-graphql';
import { FileUpload } from 'graphql-upload';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { GraphQLUpload } from 'graphql-upload';
import { uploadToGoogleDrive } from '../utils/helper';

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

    // upload to google drive
    const urlResponse = await uploadToGoogleDrive(photo);

    // add photo url to database
    if (photo) movie.photo = urlResponse.url;
    else
      movie.photo =
        'https://drive.google.com/file/d/1ztVtldH1LBlJkgbqdR3MzusmFLSUbtva/view?usp=sharing';

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
      imageUrl: urlResponse.url,
    };
  }
}
