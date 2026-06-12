"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
function validate(schema) {
    return (req, res, next) => {
        const errors = [];
        const body = req.body;
        // Validar campos requeridos
        if (schema.required) {
            for (const field of schema.required) {
                if (body[field] === undefined || body[field] === null || body[field] === "") {
                    errors.push(`El campo '${field}' es requerido`);
                }
            }
        }
        // Validar enums
        if (schema.enums) {
            for (const [field, allowedValues] of Object.entries(schema.enums)) {
                if (body[field] !== undefined && !allowedValues.includes(body[field])) {
                    errors.push(`El campo '${field}' debe ser uno de: ${allowedValues.join(", ")}`);
                }
            }
        }
        // Eliminar campos no permitidos
        const allowedFields = [...(schema.required || []), ...(schema.optional || []), ...Object.keys(schema.enums || {})];
        if (allowedFields.length > 0) {
            const extraFields = Object.keys(body).filter(key => !allowedFields.includes(key));
            for (const field of extraFields) {
                delete body[field];
            }
        }
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }
        next();
    };
}
//# sourceMappingURL=validate.js.map