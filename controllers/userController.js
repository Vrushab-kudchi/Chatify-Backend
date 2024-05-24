import { User } from "../models/userModel.js";
import { uploadFile } from "../utils/cloudinary.js";
import { loginSchema, registerSchema } from "../utils/zodSchema.js";
import { generateToken } from "../utils/Features.js";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
  try {
    const data = loginSchema.safeParse(req.body);
    if (data.success) {
      const { username, password } = req.body;
      const user = await User.findOne({ username }).select("+password");
      if (!user) return next(new Error("No user found"));
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return next(new Error("Incorrect Credential"));
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
  } catch (error) {
    return next(error);
  }
};

// Create a new user and save it in database and save cookie
export const register = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(
        new Error("No file uploaded or file size exceeds the limit of 4MB")
      );
    }

    const data = registerSchema.safeParse(req.body);
    if (!data.success) {
      const errorDetails = data.error.issues[0];
      const errorResponse = {
        [errorDetails.path[0]]: errorDetails.message,
      };
      return next(new Error(errorResponse));
    }

    const usernameExists = await User.findOne({ username: req.body.username });
    if (usernameExists) {
      return next(new Error("Username already exists"));
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
    return res.status(201).json(userCreated);
  } catch (error) {
    return next(error);
  }
};
