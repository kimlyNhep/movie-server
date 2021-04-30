import { UserRoles } from "./../enumType";
import {
  LoginResponse,
  RegisterResponse,
  UserLoginInput,
  UserRegisterInput,
} from "./../types/user";
import { sendRefreshToken } from "./../sendRefreshToken";
import { isAuth } from "./../middleware/auth";
import { accessToken } from "./../token";
import { MovieContext } from "./../MovieContext";
import { User } from "./../entity/User";
import {
  Arg,
  Mutation,
  Query,
  Resolver,
  Ctx,
  UseMiddleware,
} from "type-graphql";
import { compare, hash } from "bcryptjs";
import { validate } from "class-validator";
import { getManager } from "typeorm";

@Resolver()
export class userResolvers {
  @Query(() => User, { nullable: true })
  @UseMiddleware(isAuth)
  async me(@Ctx() { payload }: MovieContext): Promise<User | undefined> {
    const user = await User.findOne({ where: { id: payload?.id } });
    return user;
  }

  @Mutation(() => RegisterResponse)
  async register(
    @Arg("options") options: UserRegisterInput
  ): Promise<RegisterResponse> {
    const hashedPassword = await hash(options.password, 12);

    try {
      const user = new User();

      user.email = options.email;
      user.username = options.username;
      user.role = options.role || UserRoles.MEMBER;
      user.password = hashedPassword;

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
        return {
          user,
        };
      }
    } catch (err) {
      const { code } = err;

      if (code === "23505") {
        const start = err.detail.indexOf("(");
        const end = err.detail.indexOf(")");
        return {
          errors: [
            {
              field: err.detail.substring(start + 1, end),
              message: "Already exist!",
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
    @Arg("options") options: UserLoginInput,
    @Ctx() { res }: MovieContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { username: options.username } });

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "User not exist",
          },
        ],
      };
    }

    const valid = await compare(options.password, user.password);

    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "is Not Correct.",
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
  logout(@Ctx() { req, res }: MovieContext) {
    return new Promise((resolve) => {
      res.clearCookie("token");
      resolve(true);
    });
  }
}
