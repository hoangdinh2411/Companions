import express from "express";
import Routes from "./routers";
const app = express();

Routes(app);

export default app;
