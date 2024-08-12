import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { verify } from "jsonwebtoken";
import { AnyZodObject } from "zod";

export const schemaValidationMiddleware =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (e) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
    }
  };

export const validateAccessToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  if (
    accessToken == null ||
    !verify(accessToken, process.env.ACCESS_TOKEN_PUBLIC_KEY || "")
  ) {
    res.sendStatus(StatusCodes.UNAUTHORIZED);
    return;
  }
  next();
};
