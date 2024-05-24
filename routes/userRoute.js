import express from "express";
import { login, register } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";

const route = express.Router();

route.post("/login", login);
route.post("/register", upload.single("avatar"), register);

export default route;
