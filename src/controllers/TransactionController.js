import { BadRequestError } from "../helpers/ApiError.js";
import TransactionService from "../services/TransactionService.js";

class TransactionController {
    async Create(req, res) {
        const { value, dateHour } = req.body;

        if (!req.body || typeof req.body !== "object") {
            throw new BadRequestError(
                "Request body must be a valid JSON object."
            );
        }

        await TransactionService.Create(value, dateHour);
        return res.status(201).send();
    }

    async Delete(req, res) {
        await TransactionService.DeleteAll();
        return res.status(204).send();
    }

    async GetStatistics(req, res) {
        const stats = await TransactionService.GetStatistics();
        return res.status(200).json(stats);
    }
}

export default new TransactionController();
