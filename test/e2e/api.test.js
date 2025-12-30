import { expect, test, describe } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("API E2E Test Suite", () => {
    test("GET /health - should return health status 200", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("status", "UP");
        expect(response.body).toHaveProperty(
            "message",
            "Database connection is healthy."
        );
    });

    test("POST /transaction - should create a transaction and return 201", async () => { 
        const transactionData = {
            value: 100.5,
            dateHour: new Date().toISOString(),
        };
        const response = await request(app)
            .post("/transaction")
            .send(transactionData);
        expect(response.status).toBe(201);
    });

    test("DELETE /transaction - should delete all transactions and return 204", async () => {
        const response = await request(app).delete("/transaction");
        expect(response.status).toBe(204);
    });

    test("GET /statistics - should return statistics stats 200", async () => {
        const response = await request(app).get("/statistics");
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("sum");
        expect(response.body).toHaveProperty("avg");
        expect(response.body).toHaveProperty("max");
        expect(response.body).toHaveProperty("min");
        expect(response.body).toHaveProperty("count");
    });
});
