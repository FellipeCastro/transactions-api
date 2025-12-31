import { Router } from "express";
import swaggerSpec from "./swagger.js";
import sequelize from "../src/config/database.js";
import TransactionController from "./controllers/TransactionController.js";

const router = Router();

// docs
router.get("/docs", (req, res) => res.json(swaggerSpec));

// health check route
router.get("/health", (req, res) => {
    sequelize
        .authenticate()
        .then(() => {
            res.status(200).json({
                status: "UP",
                message: "Database connection is healthy.",
            });
        })
        .catch((error) => {
            res.status(500).json({
                status: "DOWN",
                message: "Database connection failed.",
                error: error.message,
            });
        });
});

// transaction creation route
router.post("/transaction", TransactionController.Create);

// transaction deletion route
router.delete("/transaction", TransactionController.Delete);

// transaction statistics route
router.get("/statistics", TransactionController.GetStatistics);

export default router;
