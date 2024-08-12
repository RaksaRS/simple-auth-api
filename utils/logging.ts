import { createLogger, format, transports } from "winston";

const LOG_LEVEL = process.env.LOG_LEVEL || "info";
const logger = createLogger({
  transports: [
    new transports.Console({
      level: "info",
    }),
  ],
  format: format.combine(
    format.colorize({ level: true, colors: { info: "blue" } }),
    format.timestamp(),
    format.printf((info) => `[${info.level}]: \t${info.message}`)
  ),
});

export default logger;
