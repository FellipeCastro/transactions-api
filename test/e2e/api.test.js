import {
    expect,
    test,
    describe,
    beforeAll,
    beforeEach,
    afterAll,
} from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import sequelize from "../../src/config/database.js";
import Transaction from "../../src/models/Transaction.js";

// Dados de teste para o beforeEach
const testTransactions = [
    {
        value: 100.5,
        dateHour: new Date().toISOString(),
    },
    {
        value: 200.0,
        dateHour: new Date(Date.now() - 3600000).toISOString(),
    },
    {
        value: 50.75,
        dateHour: new Date(Date.now() - 7200000).toISOString(),
    },
];

describe("API E2E Test Suite", () => {
    // Setup e Teardown
    beforeAll(async () => {
        // Configura o ambiente de teste
        if (process.env.NODE_ENV !== "test") {
            process.env.NODE_ENV = "test";
            console.log("⚠️  Forçando NODE_ENV=test para execução dos testes");
        }

        // Verifica conexão com o banco de testes
        try {
            await sequelize.authenticate();
            console.log("✅ Conexão com banco de testes estabelecida");
        } catch (error) {
            console.error(
                "❌ Erro ao conectar ao banco de testes:",
                error.message
            );
            throw error;
        }
    });

    beforeEach(async () => {
        console.log("🧹 Cleaning database before test...");

        // Limpa completamente o banco de dados
        await Transaction.destroy({
            where: {},
            truncate: true,
            cascade: true,
            force: true,
        });

        // Insere dados de teste
        await Transaction.bulkCreate(testTransactions);

        console.log(
            `✅ Database seeded with ${testTransactions.length} test transactions`
        );
    });

    afterAll(async () => {
        try {
            // Fecha a conexão com o banco
            await sequelize.close();
            console.log("✅ Database connection closed");
        } catch (error) {
            console.error(
                "❌ Error closing database connection:",
                error.message
            );
        }
    });

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
