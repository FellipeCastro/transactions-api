import express from "express";
import cors from "cors";
import router from "./routes.js";
import errorMiddleware from "./middlawares/error.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(router);
app.use(errorMiddleware);

export default app;
