import { sign } from 'jsonwebtoken';
import { User } from './entity/User';

export const accessToken = (user: User) => {
  return sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
};

export const refreshToken = (user: User) => {
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: '7d',
  });
};
