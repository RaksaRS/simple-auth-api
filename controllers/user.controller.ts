import { Request, Response, Router } from "express";
import {
  UserSchema,
  SigninSchema,
  signupUser,
  SigninInterface,
  signinUser,
  UserInterface,
  UserPublicInfoInterface,
} from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { schemaValidationMiddleware } from "../middleware/validate";
import { verify } from "argon2";
import jwt, { SignOptions } from "jsonwebtoken";
import logger from "../utils/logging";

const router = Router();
router.post(
  "/signup",
  schemaValidationMiddleware(UserSchema),
  async (req: Request<{}, {}, UserInterface, {}, {}>, res: Response) => {
    const result = await signupUser(UserSchema.parse(req.body));
    if (result === "Duplicate email") {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "Duplicate email" });
    } else if (!result) {
      res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } else res.sendStatus(StatusCodes.CREATED);
  }
);

const accessTokenOptions: SignOptions = {
  algorithm: "RS256",
};

router.post(
  "/signin",
  schemaValidationMiddleware(SigninSchema),
  async (req: Request<{}, {}, SigninInterface, {}, {}>, res: Response) => {
    const { email, password } = req.body;

    const user = await signinUser({
      email: email,
      password: password,
    });

    if (user == null) {
      res.status(StatusCodes.NOT_FOUND).send("Invalid email or password");
      return;
    }

    if (!(await verify(user.password, password))) {
      res.status(StatusCodes.UNAUTHORIZED).send("Invalid email or password");
      return;
    }

    const accessToken = jwt.sign(
      { email: email, username: user.username },
      process.env.ACCESS_TOKEN_PRIVATE_KEY || "",
      accessTokenOptions
    );

    logger.info(`Signin - Sigin successful for user ${email}-${user.username}`);

    res.cookie("accessToken", accessToken, {
      signed: false,
      maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
      secure: true,
      sameSite: true,
    });
    res.sendStatus(200);
  }
);

export default router;
