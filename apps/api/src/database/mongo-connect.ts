import createHttpError from "http-errors";
import mongoose from "mongoose";
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.DB || "", {});
    console.log("MONGODB CONNECT SUCCESSFULLY!!!");
  } catch (error) {
    console.log("MONGODB CONNECT ERROR:::", error);
    createHttpError[500]("MONGODB CONNECT ERROR:" + error);
  }
}

export default connectDatabase;
