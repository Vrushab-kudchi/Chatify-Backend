import express from "express";
import bodyParser from "body-parser";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

//db
import { connectDB } from "./utils/ConnectDB.js";

//Routes
import userRoute from "./routes/userRoute.js";
import chatRoute from "./routes/chatRoute.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const mongoURI = process.env.MONGO_URL;
connectDB(mongoURI);

//handle error

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

//Routes
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

app.all("*", (req, res, next) => {
  const err = new Error(`can't find ${req.originalUrl} on the server`);
  err.status = "fail";
  err.statusCode = 404;
  next(err);
});
// Global error handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
