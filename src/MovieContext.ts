import { UserRoles } from "./enumType";
import { Request, Response } from "express";

export interface MovieContext {
  req: Request;
  res: Response;
  payload?: { id: string; username: string; email: string; role: UserRoles };
}
