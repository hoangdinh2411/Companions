import createHttpError from "http-errors";
import mongoose from "mongoose";
import { logEvent } from "../../v1/helpers/log-helper";
async function connectDatabase() {
  try {
    await mongoose.connect(process.env.DB || "", {});
    logEvent("MONGODB CONNECT SUCCESSFULLY!!!");
  } catch (error) {
    logEvent("MONGODB CONNECT ERROR:" + error);
    createHttpError[500]("MONGODB CONNECT ERROR:" + error);
  }
}

export default connectDatabase;
