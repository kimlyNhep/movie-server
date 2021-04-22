import { UserRoles } from './../enumType';
import { User } from './../entity/User';
import { Field, InputType, ObjectType, registerEnumType } from 'type-graphql';

registerEnumType(UserRoles, {
  name: 'UserRoles',
});

@ObjectType()
export class LoginResponse {
  @Field(() => String, { nullable: true })
  accessToken?: string;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
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
class ErrorResponse {
  @Field()
  field?: string;

  @Field()
  message?: string;
}

@ObjectType()
export class RegisterResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];
}
