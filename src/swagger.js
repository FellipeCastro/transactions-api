export default {
    openapi: "3.0.0",
    info: {
        title: "Transaction Statistics API",
        version: "1.0.0",
        description: "API for managing transactions and generating statistics from the last 60 seconds",
    },
    servers: [{ url: "http://localhost:5000" }],
    components: {
        schemas: {
            Transaction: {
                type: "object",
                properties: {
                    id: {
                        type: "integer",
                        example: 1,
                        description: "Unique transaction identifier",
                    },
                    value: {
                        type: "number",
                        format: "double",
                        example: 123.45,
                        description: "Transaction value (non-negative number)",
                    },
                    dateHour: {
                        type: "string",
                        format: "date-time",
                        example: "2024-01-15T10:30:00.000Z",
                        description: "Transaction timestamp (cannot be in the future)",
                    },
                },
            },
            TransactionRequest: {
                type: "object",
                properties: {
                    value: {
                        type: "number",
                        format: "double",
                        example: 123.45,
                        description: "Transaction value (non-negative number)",
                    },
                    dateHour: {
                        type: "string",
                        format: "date-time",
                        example: "2024-01-15T10:30:00.000Z",
                        description: "Transaction timestamp (ISO 8601 format)",
                    },
                },
                required: ["value", "dateHour"],
            },
            StatisticsResponse: {
                type: "object",
                properties: {
                    count: {
                        type: "integer",
                        example: 10,
                        description: "Number of transactions in the last 60 seconds",
                    },
                    sum: {
                        type: "number",
                        format: "double",
                        example: 1234.56,
                        description: "Sum of transaction values in the last 60 seconds",
                    },
                    avg: {
                        type: "number",
                        format: "double",
                        example: 123.456,
                        description: "Average transaction value in the last 60 seconds",
                    },
                    min: {
                        type: "number",
                        format: "double",
                        example: 12.34,
                        description: "Minimum transaction value in the last 60 seconds",
                    },
                    max: {
                        type: "number",
                        format: "double",
                        example: 456.78,
                        description: "Maximum transaction value in the last 60 seconds",
                    },
                },
            },
            HealthResponse: {
                type: "object",
                properties: {
                    status: {
                        type: "string",
                        enum: ["UP", "DOWN"],
                        example: "UP",
                        description: "Service status",
                    },
                    message: {
                        type: "string",
                        example: "Database connection is healthy.",
                        description: "Status message",
                    },
                    error: {
                        type: "string",
                        example: "Connection refused",
                        description: "Error details (only when status is DOWN)",
                    },
                },
            },
            ErrorResponse: {
                type: "object",
                properties: {
                    message: { 
                        type: "string",
                        example: "Validation failed",
                        description: "Error message"
                    },
                    statusCode: {
                        type: "integer",
                        example: 400,
                        description: "HTTP status code"
                    }
                },
            },
        },
    },
    paths: {
        "/health": {
            get: {
                summary: "Health check",
                description: "Check if the service and database connection are healthy",
                responses: {
                    200: {
                        description: "Service is healthy",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/HealthResponse",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Service is unhealthy",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/HealthResponse",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/transaction": {
            post: {
                summary: "Create a transaction",
                description: "Create a new transaction with value and timestamp. The transaction will be considered in statistics for the next 60 seconds.",
                requestBody: {
                    description: "Transaction data to be created",
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/TransactionRequest",
                            },
                            example: {
                                value: 123.45,
                                dateHour: "2024-01-15T10:30:00.000Z"
                            },
                        },
                    },
                },
                responses: {
                    201: {
                        description: "Transaction created successfully",
                    },
                    400: {
                        description: "Bad Request - Invalid request body format",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                                example: {
                                    message: "Request body must be a valid JSON object.",
                                    statusCode: 400
                                }
                            },
                        },
                    },
                    422: {
                        description: "Unprocessable Entity - Validation error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ErrorResponse",
                                },
                                examples: {
                                    missingFields: {
                                        value: {
                                            message: "Value and dateHour are required.",
                                            statusCode: 422
                                        }
                                    },
                                    futureDate: {
                                        value: {
                                            message: "dateHour cannot be in the future.",
                                            statusCode: 422
                                        }
                                    },
                                    invalidDate: {
                                        value: {
                                            message: "dateHour must be a valid date.",
                                            statusCode: 422
                                        }
                                    },
                                    invalidValue: {
                                        value: {
                                            message: "Value must be a non-negative number.",
                                            statusCode: 422
                                        }
                                    }
                                }
                            },
                        },
                    },
                },
            },
            delete: {
                summary: "Delete all transactions",
                description: "Remove all transactions from the database. This action cannot be undone.",
                responses: {
                    204: {
                        description: "All transactions deleted successfully",
                    },
                },
            },
        },
        "/statistics": {
            get: {
                summary: "Get transaction statistics",
                description: "Get statistics (count, sum, average, min, max) for transactions created in the last 60 seconds. If no transactions exist in the last 60 seconds, returns zero values.",
                responses: {
                    200: {
                        description: "Statistics retrieved successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/StatisticsResponse",
                                },
                                examples: {
                                    withTransactions: {
                                        value: {
                                            count: 10,
                                            sum: 1234.56,
                                            avg: 123.456,
                                            min: 12.34,
                                            max: 456.78
                                        }
                                    },
                                    noTransactions: {
                                        value: {
                                            count: 0,
                                            sum: 0,
                                            avg: 0,
                                            min: 0,
                                            max: 0
                                        }
                                    }
                                }
                            },
                        },
                    },
                },
            },
        },
    },
    tags: [
        {
            name: "Health",
            description: "Health check endpoints",
        },
        {
            name: "Transactions",
            description: "Transaction management endpoints",
        },
        {
            name: "Statistics",
            description: "Transaction statistics endpoints",
        },
    ],
};