import express from "express";
import {
  SearchUsers,
  login,
  logout,
  profile,
  register,
} from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const route = express.Router();

route.post("/login", login);
route.post("/register", upload.single("avatar"), register);

route.get("/profile", isAuthenticated, profile);
route.get("/logout", isAuthenticated, logout);
route.get("/search-user", isAuthenticated, SearchUsers);

export default route;
