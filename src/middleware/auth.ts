import { verify } from "jsonwebtoken";
import { MovieContext } from "src/MovieContext";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MovieContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) throw new Error("Not Authenticated");

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch {
    throw new Error("Not Authenticated");
  }

  return next();
};
