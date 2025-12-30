import { Op } from "sequelize";
import Transaction from "../models/Transaction.js";

class TransactionRepository {
    async Create(value, dateHour) {
        await Transaction.create({ value, dateHour });
    }

    async DeleteAll() {
        await Transaction.destroy({ where: {} });
    }

    async FindById(idTransaction) {
        return await Transaction.findByPk(idTransaction);
    }
}

export default new TransactionRepository();
