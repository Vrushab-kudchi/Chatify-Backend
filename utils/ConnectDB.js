import mongoose from "mongoose";

export const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "Chatify" })
    .then((data) => {
      console.log(
        `Database connected : ${data.connection.host} Name : ${data.connection.name}`
      );
    })
    .catch((err) => {
      throw err;
    });
};
