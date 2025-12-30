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
        const { idTransaction } = req.params;

        await TransactionService.Delete(idTransaction);
        return res.status(204).send();
    }
}

export default new TransactionController();
