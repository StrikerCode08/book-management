import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
enum Role {
    User = 'user',
    Admin = 'admin',
  }
  interface DecodedToken {
    user: {};
    // Add other properties as needed
  }
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
    const token = req.header('Authorization')?.replace('Bearer ', '') || "";
    try {
        
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as DecodedToken;
        if(decoded.user === Role.Admin){
            next();
        }
    } catch (ex) {
        res.status(400).send('Invalid token.');
    }
  }

export {authenticateAdmin}