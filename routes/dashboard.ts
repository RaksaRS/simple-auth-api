import { Router, Request, Response } from "express";
import { validateAccessToken } from "../middleware/validate";
import jwt from "jsonwebtoken";
import { UserPublicInfoInterface } from "../services/user.service";

const router = Router();

router.get("/dashboard", validateAccessToken, (req: Request, res: Response) => {
  const user = jwt.decode(req.cookies.accessToken) as UserPublicInfoInterface;
  res
    .status(200)
    .send(`Horay! You're authorized ${user.email}-${user.username}`);
});

export default router;
