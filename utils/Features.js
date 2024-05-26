import jwt from "jsonwebtoken";
import dotenv, { config } from "dotenv";
dotenv, config();

export const generateToken = (user) => {
  try {
    var token = jwt.sign(
      JSON.stringify({ _id: user._id }),
      process.env.JWT_SECRET
    );
    return token;
  } catch (error) {
    console.log(error);
  }
};

export const emitEvent = (req, event, users, data) => {
  console.log("Emitting event", event);
};
