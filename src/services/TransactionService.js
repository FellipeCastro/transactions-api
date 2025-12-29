import TransactionRepository from "../repositories/TransactionRepository.js";

class TransactionService {
    async Create(value, dateHour) {
        // Lógica de negócio
        return await TransactionRepository.Create(value, dateHour);
    }
}

export default new TransactionService();
