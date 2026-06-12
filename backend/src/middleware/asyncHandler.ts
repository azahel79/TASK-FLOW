import { Request, Response, NextFunction } from "express";

type AsyncRouteHandler<P = Record<string, string>> = (
  req: Request<P>,
  res: Response,
  next: NextFunction
) => Promise<unknown>;

export const asyncHandler = <P = Record<string, string>>(fn: AsyncRouteHandler<P>) => {
  return (req: Request<P>, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
