import { Request, Response, NextFunction } from "express";
type AsyncRouteHandler<P = Record<string, string>> = (req: Request<P>, res: Response, next: NextFunction) => Promise<unknown>;
export declare const asyncHandler: <P = Record<string, string>>(fn: AsyncRouteHandler<P>) => (req: Request<P>, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=asyncHandler.d.ts.map