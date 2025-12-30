import Transaction from "../models/Transaction.js";

class TransactionRepository {
    async Create(value, dateHour) {
        await Transaction.create({ value, dateHour });
    }

    async Delete(idTransaction) {
        await Transaction.destroy({ where: { id: idTransaction } });
    }

    async FindById(idTransaction) {
        return await Transaction.findByPk(idTransaction);
    }
}

export default new TransactionRepository();
