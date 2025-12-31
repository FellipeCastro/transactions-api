export class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// uso geral para parâmetros faltantes ou inválidos
export class BadRequestError extends ApiError {
    constructor(message) {
        super(message, 400);
    }
}

// validação semântica que não é sintaticamente inválida
export class UnprocessableEntityError extends ApiError {
    constructor(message) {
        super(message, 422);
    }
}
