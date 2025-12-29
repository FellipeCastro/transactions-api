import Transaction from "../models/Transaction.js";

class TransactionRepository {
    async Create(value, dateHour) {
        await Transaction.create({ value, dateHour });
    }
}

export default new TransactionRepository();
