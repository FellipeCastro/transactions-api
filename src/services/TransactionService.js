import { UnprocessableEntityError } from "../helpers/ApiError.js";
import TransactionRepository from "../repositories/TransactionRepository.js";

class TransactionService {
    async Create(value, dateHour) {
        if (
            value === undefined ||
            value === null ||
            dateHour === undefined ||
            dateHour === null
        ) {
            throw new UnprocessableEntityError(
                "Value and dateHour are required."
            );
        }

        const transactionDate = new Date(dateHour);
        const now = new Date();

        if (transactionDate > now) {
            throw new UnprocessableEntityError(
                "dateHour cannot be in the future."
            );
        }

        if (isNaN(transactionDate.getTime())) {
            throw new UnprocessableEntityError(
                "dateHour must be a valid date."
            );
        }

        if (typeof value !== "number" || value < 0) {
            throw new UnprocessableEntityError(
                "Value must be a non-negative number."
            );
        }

        return await TransactionRepository.Create(value, dateHour);
    }

    async DeleteAll() {
        return await TransactionRepository.DeleteAll();
    }

    async GetStatistics(seconds = 60) {
        const result = await TransactionRepository.GetStatistics(seconds);
        
        if (!result || !result.count || parseInt(result.count) === 0) {
            return {
                count: 0,
                sum: 0,
                avg: 0,
                min: 0,
                max: 0,
            };
        }

        return {
            count: parseInt(result.count),
            sum: parseFloat(result.sum) || 0,
            avg: parseFloat(result.avg) || 0,
            min: parseFloat(result.min) || 0,
            max: parseFloat(result.max) || 0,
        };
    }
}

export default new TransactionService();
