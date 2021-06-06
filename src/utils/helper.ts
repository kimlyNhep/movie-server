import { MovieContext } from '../MovieContext';

export const getUserLogged = ({ req }: MovieContext) => {
  const token = req.cookies;
  console.log(token);
};

export const getEnvHost = () => {
  if (process.env.NODE_NEV === 'production') return process.env.HOST;
  else return process.env.HOST_DEV;
};
