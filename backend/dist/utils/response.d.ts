import { Response } from "express";
export declare function sendSuccess<T>(res: Response, data: T, statusCode?: number, message?: string): Response<any, Record<string, any>>;
export declare function sendPaginated<T>(res: Response, data: T[], total: number, page: number, limit: number, statusCode?: number): Response<any, Record<string, any>>;
//# sourceMappingURL=response.d.ts.map