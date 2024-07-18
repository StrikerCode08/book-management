// src/types/express.d.ts or types/express.d.ts
import { JwtPayload } from 'jsonwebtoken';
import {IUser} from './models/User'
declare global {
  namespace Express {
    interface Request {
      user: IUser
    }
  }
}

