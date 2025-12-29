import TransactionService from "../services/TransactionService.js";

class TransactionController {
    async Create(req, res) {
        const { value, dateHour } = req.body;

        await TransactionService.Create(value, dateHour);
        return res.status(201);
    }
}

export default new TransactionController();
