import zod, { boolean, TypeOf } from "zod";
import db from "../utils/database";
import { hash } from "argon2";
import logger from "../utils/logging";
import { QueryError, RowDataPacket } from "mysql2";

const UserSchema = zod.object({
  username: zod.string().trim().toLowerCase(),
  email: zod.string().trim().email({ message: "Invalid email" }),
  password: zod.string(),
});
type UserInterface = zod.infer<typeof UserSchema>;

const UserPublicInfoSchema = UserSchema.omit({ password: true });
type UserPublicInfoInterface = Omit<UserInterface, "password">;

const SigninSchema = zod.object({
  email: zod.string().trim().email({ message: "Invalid email" }),
  password: zod.string(),
});
type SigninInterface = zod.infer<typeof SigninSchema>;

const signupUserSqlCmd = `INSERT INTO User(username, email, password)
VALUES(?, ?, ?)`;

async function signupUser(
  userInfo: UserInterface
): Promise<boolean | "Duplicate email"> {
  const hashedPassword = await hash(userInfo.password);

  try {
    const result = await new Promise(
      (res: (r: boolean) => void, rej: (e: Error) => void) => {
        db.query(
          signupUserSqlCmd,
          [userInfo.username, userInfo.email, hashedPassword],
          (err, result, fields) => {
            if (err != null) rej(err);
            else res(true);
          }
        );
      }
    );
    logger.info(
      `Signup successful for user: ${userInfo.email}-${userInfo.username}`
    );
    return true;
  } catch (e) {
    if (e instanceof Error) {
      const castedErr = e as QueryError;

      if (castedErr.errno === 1062) {
        logger.error(
          `MySQL-1062- Attempted to insert user with an already existing email`
        );
        return "Duplicate email";
      } else
        logger.error(
          `MySQL-${castedErr.errno}-${castedErr.name}-${castedErr.message} resulted from attempting to insert user`
        );
    }
    return false;
  }
}

async function signinUser(
  signinInfo: SigninInterface
): Promise<null | UserInterface> {
  const { email } = signinInfo;
  return await new Promise((res, rej) => {
    db.query(
      "SELECT username, email, password FROM User WHERE email=?",
      [email],
      (err, rows: RowDataPacket[], fields) => {
        if (err != null) {
          res(null);
          return;
        }
        console.log(`Signin - Rows: ${rows[0]}`);
        res(rows[0] as UserInterface);
      }
    );
  });
}

export {
  UserSchema,
  UserInterface,
  UserPublicInfoSchema,
  UserPublicInfoInterface,
  SigninSchema,
  SigninInterface,
  signupUser,
  signinUser,
};
