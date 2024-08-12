import express, { json } from "express";
import logger from "./utils/logging";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import gracefulShutdown from "./utils/gracefulShutdown";
import userRouter from "./controllers/user.controller";
import dashboardRouter from "./routes/dashboard";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser(process.env.ACCESS_TOKEN_PRIVATE_KEY || ""));

app.use("/user", userRouter);
app.use("/", dashboardRouter);

app.listen(PORT, () => {
  logger.info(`Server is listening on port ${PORT}`);
});

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
