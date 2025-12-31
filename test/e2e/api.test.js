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

// Dados de teste
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

// Configuração do ambiente de teste
const setupTestEnvironment = async () => {
    if (process.env.NODE_ENV !== "test") {
        process.env.NODE_ENV = "test";
        console.log("Ambiente configurado para testes");
    }

    try {
        await sequelize.authenticate();
        console.log("Conexão com banco estabelecida");
    } catch (error) {
        console.error("Erro ao conectar ao banco:", error.message);
        throw error;
    }
};

const cleanupDatabase = async () => {
    console.log("Limpando banco de dados...");

    await Transaction.destroy({
        where: {},
        truncate: true,
        cascade: true,
        force: true,
    });

    await Transaction.bulkCreate(testTransactions);
    console.log(
        `Dados de teste inseridos: ${testTransactions.length} transações`
    );
};

const closeDatabaseConnection = async () => {
    try {
        await sequelize.close();
        console.log("Conexão com banco encerrada");
    } catch (error) {
        console.error("Erro ao encerrar conexão:", error.message);
    }
};

// Funções auxiliares
const createTransactionData = (value, dateHour) => ({ value, dateHour });

const createFutureDate = () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 1);
    return futureDate;
};

// Testes
describe("API E2E Test Suite", () => {
    beforeAll(setupTestEnvironment);
    beforeEach(cleanupDatabase);
    afterAll(closeDatabaseConnection);

    describe("Health Check", () => {
        test("GET /health deve retornar status 200", async () => {
            const response = await request(app).get("/health");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("status", "UP");
            expect(response.body).toHaveProperty(
                "message",
                "Database connection is healthy."
            );
        });
    });

    describe("Criação de Transações", () => {
        test("POST /transaction deve criar transação e retornar 201", async () => {
            const transactionData = createTransactionData(
                100.5,
                new Date().toISOString()
            );

            const response = await request(app)
                .post("/transaction")
                .send(transactionData);

            expect(response.status).toBe(201);
        });

        test("POST /transaction deve retornar 422 quando valor e data são nulos", async () => {
            const transactionData = { value: null, dateHour: null };

            const response = await request(app)
                .post("/transaction")
                .send(transactionData);

            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty(
                "error",
                "Value and dateHour are required."
            );
        });

        test("POST /transaction deve retornar 422 quando data está no futuro", async () => {
            const futureDate = createFutureDate();
            const transactionData = createTransactionData(
                100.5,
                futureDate.toISOString()
            );

            const response = await request(app)
                .post("/transaction")
                .send(transactionData);

            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty(
                "error",
                "dateHour cannot be in the future."
            );
        });

        test("POST /transaction deve retornar 422 quando data é inválida", async () => {
            const transactionData = createTransactionData(
                100.5,
                "invalid-date-string"
            );

            const response = await request(app)
                .post("/transaction")
                .send(transactionData);

            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty(
                "error",
                "dateHour must be a valid date."
            );
        });

        test("POST /transaction deve retornar 422 quando valor é negativo", async () => {
            const transactionData = {
                value: -100.5,
                dateHour: new Date().toISOString(),
            };

            const response = await request(app)
                .post("/transaction")
                .send(transactionData);

            expect(response.status).toBe(422);
            expect(response.body).toHaveProperty(
                "error",
                "Value must be a non-negative number."
            );
        });
    });

    describe("Exclusão de Transações", () => {
        test("DELETE /transaction deve apagar todas transações e retornar 204", async () => {
            const response = await request(app).delete("/transaction");
            expect(response.status).toBe(204);
        });
    });

    describe("Estatísticas", () => {
        test("GET /statistics deve retornar estatísticas com status 200", async () => {
            const response = await request(app).get("/statistics");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("count", 1);
            expect(response.body).toHaveProperty("sum", 100.5);
            expect(response.body).toHaveProperty("avg", 100.5);
            expect(response.body).toHaveProperty("min", 100.5);
            expect(response.body).toHaveProperty("max", 100.5);
        });
    });
});
