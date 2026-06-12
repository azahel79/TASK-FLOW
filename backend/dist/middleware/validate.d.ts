import { Request, Response, NextFunction } from "express";
interface ValidationSchema {
    required?: string[];
    optional?: string[];
    enums?: Record<string, string[]>;
}
export declare function validate(schema: ValidationSchema): (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=validate.d.ts.map