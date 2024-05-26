import { User } from "../models/userModel.js";
import { uploadFile } from "../utils/cloudinary.js";
import { loginSchema, registerSchema } from "../utils/zodSchema.js";
import { generateToken } from "../utils/Features.js";
import bcrypt from "bcrypt";
import { TryCatch } from "../middlewares/error.js";
import ErrorHandler from "../utils/errorHandler.js";

// lets you login and set a cookie
export const login = TryCatch(async (req, res, next) => {
  const data = loginSchema.safeParse(req.body);
  if (data.success) {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("No user found", 404));
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new ErrorHandler("Incorrect Credential", 404));
    } else {
      const token = await generateToken(user);
      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        secure: true,
      });
      return res.status(200).json("Success");
    }
  } else {
    const errorDetails = data.error.issues[0];
    const errorResponse = {
      [errorDetails.path[0]]: errorDetails.message,
    };
    return res.status(400).json(errorResponse);
  }
});

// Create a new user and save it in database and save cookie
export const register = TryCatch(async (req, res, next) => {
  if (!req.file) {
    return next(
      new ErrorHandler(
        "No file uploaded or file size exceeds the limit of 4MB",
        400
      )
    );
  }

  const data = registerSchema.safeParse(req.body);
  if (!data.success) {
    const errorDetails = data.error.issues[0];
    const errorResponse = {
      [errorDetails.path[0]]: errorDetails.message,
    };
    return next(new ErrorHandler(errorResponse));
  }

  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists) {
    return next(new ErrorHandler("Username already exists", 409));
  }

  // Image handling
  const avatar = req.file;
  const { public_id, url } = await uploadFile(avatar);
  req.body.avatar = { public_id, url };

  // Create user
  const userCreated = await User.create(req.body);
  delete userCreated.password;
  const token = await generateToken(userCreated);
  res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  return res.status(201).json({ Success: "user created" });
});

// gives user information
export const profile = TryCatch(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json(user);
});

// removes cookie from browser
export const logout = (req, res) => {
  res
    .status(200)
    .cookie("token", null, { maxAge: 0 })
    .json({ Success: "Logout Successful" });
};

//Search new users
export const SearchUsers = TryCatch(async (req, res) => {
  const { username } = req.query;

  const users = await User.find({ username });
  res.status(200).json(users);
});
