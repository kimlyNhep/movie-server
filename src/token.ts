import { sign } from "jsonwebtoken";
import { User } from "./entity/User";

export const accessToken = (user: User) => {
  return sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );
};

export const refreshToken = (user: User) => {
  return sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
};
