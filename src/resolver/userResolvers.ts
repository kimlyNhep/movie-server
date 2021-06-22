import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { UserRoles } from './../enumType';
import {
  LoginResponse,
  RegisterResponse,
  UserLoginInput,
  UserRegisterInput,
} from './../types/user';
import { sendRefreshToken } from './../sendRefreshToken';
import { isAuth } from './../middleware/auth';
import { accessToken } from './../token';
import { MovieContext } from './../MovieContext';
import { User } from './../entity/User';
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Ctx,
  UseMiddleware,
  ObjectType,
  Field,
} from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import { validate } from 'class-validator';
import { getManager, getRepository } from 'typeorm';
import { uploadToGoogleDrive } from '../utils/helper';

@ObjectType()
class NumberUserType {
  @Field(() => Number)
  total: number;
}

@Resolver()
export class userResolvers {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { payload }: MovieContext): Promise<User | undefined> {
    const user = await User.findOne({ where: { id: payload?.id } });
    return user;
  }

  @Query(() => NumberUserType)
  async getTotalUsers(): Promise<NumberUserType> {
    const numberOfUser = await getRepository(User)
      .createQueryBuilder()
      .getCount();
    return {
      total: numberOfUser,
    };
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Ctx() { res }: MovieContext,
    @Arg('options') options: UserRegisterInput,
    @Arg('photo', () => GraphQLUpload, { nullable: true }) photo?: FileUpload
  ): Promise<RegisterResponse> {
    const hashedPassword = await hash(options.password, 12);

    try {
      let url: string;

      if (photo) {
        const urlResponse = await uploadToGoogleDrive(photo);
        url = urlResponse.url;
      } else {
        url =
          'https://drive.google.com/uc?export=download&id=1pgPBdC3-qZP_rjXN86Lv0TZQex3VEZBT';
      }

      const user = new User();

      user.email = options.email;
      user.username = options.username;
      user.role = options.role || UserRoles.Member;
      user.password = hashedPassword;
      user.photo = url;

      const errors = await validate(user);
      if (errors.length > 0) {
        return {
          errors: errors.map((error) => {
            const { constraints, property } = error;
            const key = Object.keys(constraints!)[0];
            return { field: property, message: constraints![key] };
          }),
        };
      } else {
        await getManager().save(user);

        sendRefreshToken(res, accessToken(user));

        return {
          user,
          accessToken: accessToken(user),
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

  @Mutation(() => LoginResponse)
  async login(
    @Arg('options') options: UserLoginInput,
    @Ctx() { res }: MovieContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { username: options.username } });

    if (!user) {
      return {
        errors: [
          {
            field: 'username',
            message: 'User not exist',
          },
        ],
      };
    }

    const valid = await compare(options.password, user.password);

    if (!valid) {
      return {
        errors: [
          {
            field: 'password',
            message: 'is Not Correct.',
          },
        ],
      };
    }

    sendRefreshToken(res, accessToken(user));

    return {
      accessToken: accessToken(user),
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { res }: MovieContext) {
    return new Promise((resolve) => {
      res.clearCookie('token');
      resolve(true);
    });
  }
}
