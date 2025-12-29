import express from "express";
import cors from "cors";
import router from "./routes.js";
import errorMiddleware from "./middlawares/error.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorMiddleware);

export default app;
