const errorMiddleware = (error, req, res, next) => {
    const statusCode = error.statusCode ?? 500;
    const message =
        error.message && error.statusCode
            ? error.message
            : "Internal Server Error";
    return res.status(statusCode).json({ error: message });
};

export default errorMiddleware;
