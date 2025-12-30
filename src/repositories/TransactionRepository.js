import { Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import Transaction from "../models/Transaction.js";

class TransactionRepository {
    async Create(value, dateHour) {
        await Transaction.create({ value, dateHour });
    }

    async DeleteAll() {
        await Transaction.destroy({ where: {} });
    }

    async GetStatistics(seconds) {
        const cutoff = new Date(Date.now() - seconds * 1000);

        const result = await Transaction.findOne({
            attributes: [
                [sequelize.fn("COUNT", sequelize.col("id")), "count"],
                [sequelize.fn("SUM", sequelize.col("value")), "sum"],
                [sequelize.fn("AVG", sequelize.col("value")), "avg"],
                [sequelize.fn("MIN", sequelize.col("value")), "min"],
                [sequelize.fn("MAX", sequelize.col("value")), "max"],
            ],
            where: {
                dateHour: {
                    [Sequelize.Op.gte]: cutoff,
                },
            },
            raw: true,
        });

        return result;
    }
}

export default new TransactionRepository();
