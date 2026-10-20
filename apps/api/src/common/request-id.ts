import { randomUUID } from 'node:crypto';
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

const VALID = /^[A-Za-z0-9._:-]{1,128}$/;

/** `X-Request-Id`: istemcininki geçerliyse korunur, yoksa üretilir; yanıta ve isteğe yazılır. */
export function requestId(req: Request, res: Response, next: NextFunction): void {
  const given = req.headers['x-request-id'];
  const id = typeof given === 'string' && VALID.test(given) ? given : randomUUID();
  req.headers['x-request-id'] = id;
  res.setHeader('X-Request-Id', id);
  next();
}

/** İsteğin kimliği (denetim kaydı için). */
export const RequestId = createParamDecorator((_: unknown, ctx: ExecutionContext): string =>
  String(ctx.switchToHttp().getRequest<Request>().headers['x-request-id'] ?? ''),
);
