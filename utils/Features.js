import jwt from "jsonwebtoken";
import dotenv, { config } from "dotenv";
dotenv, config();

export const generateToken = (user) => {
  try {
    var token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET);
    return token;
  } catch (error) {
    console.log(error);
  }
};
