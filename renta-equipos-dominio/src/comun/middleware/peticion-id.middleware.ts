import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';   // genera ids unicos, viene con Node

@Injectable()
export class PeticionIdMiddleware implements NestMiddleware {
  
  use(req: Request, res: Response, next: NextFunction) {
    
    const id = (req.headers['x-request-id'] as string) ?? randomUUID();

    res.setHeader('X-Request-Id', id);

    next();
  }
}
