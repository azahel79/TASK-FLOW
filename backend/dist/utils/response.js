"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccess = sendSuccess;
exports.sendPaginated = sendPaginated;
function sendSuccess(res, data, statusCode = 200, message) {
    const response = { success: true, data };
    if (message)
        response.message = message;
    return res.status(statusCode).json(response);
}
function sendPaginated(res, data, total, page, limit, statusCode = 200) {
    const response = {
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
    return res.status(statusCode).json(response);
}
//# sourceMappingURL=response.js.map