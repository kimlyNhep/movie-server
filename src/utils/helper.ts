import { MovieContext } from '../MovieContext';

export const getUserLogged = ({ req }: MovieContext) => {
  const token = req.cookies;
  console.log(token);
};
