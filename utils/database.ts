import { createPool } from "mysql2";
import logger from "./logging";

const db = createPool({
  port: process.env.DB_PORT as number | undefined,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

logger.info("Created MySQL Pool");

export default db;
export const endDb = () => {
  db.end((err: NodeJS.ErrnoException | null, args) => {
    if (err != null) logger.error(`MySQL-Error-${err.name} - ${err.message}`);
  });

  logger.info("DB shutdown successful");
};
