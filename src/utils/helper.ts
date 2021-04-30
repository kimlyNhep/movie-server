import { MovieContext } from "../MovieContext";
import { decode } from "jsonwebtoken";

export const getUserLogged = ({ req }: MovieContext) => {
  const token = req.cookies;
  console.log(token);
};
