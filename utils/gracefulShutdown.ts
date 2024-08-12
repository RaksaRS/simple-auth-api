import { endDb } from "./database";
import logger from "./logging";

export default () => {
  endDb();
  logger.info("Server shutting down");
};
