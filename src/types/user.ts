import { UserRoles } from "./../enumType";
import { User } from "./../entity/User";
import { Field, InputType, ObjectType, registerEnumType } from "type-graphql";
import { ErrorResponse } from "./error";

registerEnumType(UserRoles, {
  name: "UserRoles",
});

@ObjectType()
export class LoginResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}

@ObjectType()
export class MeResponse {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => UserRoles)
  role?: UserRoles;
}

@InputType()
export class UserRegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field(() => UserRoles, { nullable: true })
  role?: UserRoles;

  @Field()
  password: string;
}

@InputType()
export class UserLoginInput {
  @Field()
  username: string;

  @Field()
  password: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
