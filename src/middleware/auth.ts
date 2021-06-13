import { UserRoles } from '../enumType';
import { User } from '../entity/User';
import { verify, decode } from 'jsonwebtoken';
import { MovieContext } from 'src/MovieContext';
import { MiddlewareFn } from 'type-graphql';

interface IToken {
  id?: string;
}

export const isAuth: MiddlewareFn<MovieContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  if (!authorization) throw new Error('Not Authenticated');

  try {
    const token = authorization.split(' ')[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch {
    throw new Error('Not Authenticated');
  }

  return next();
};

export const isLogged: MiddlewareFn<MovieContext> = ({ context }, next) => {
  const authorization = context.req.headers['authorization'];

  try {
    const token = authorization?.split(' ')[1];
    if (token) {
      const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      context.payload = payload as any;
    }
  } catch {
    context.payload = undefined;
  }

  return next();
};

export const isAdmin: MiddlewareFn<MovieContext> = async (
  { context },
  next
) => {
  const { token } = context.req.cookies;
  const { id } = <IToken>decode(token);

  const user = await User.findOne({ where: { id } });
  if (user?.role !== UserRoles.Admin)
    throw new Error('You do not have a permission');
  else return next();
};

export const isMember: MiddlewareFn<MovieContext> = async (
  { context },
  next
) => {
  const { token } = context.req.cookies;
  const { id } = <IToken>decode(token);

  const user = await User.findOne({ where: { id } });
  if (user?.role !== UserRoles.Member)
    throw new Error('You do not have a permission');
  else return next();
};
