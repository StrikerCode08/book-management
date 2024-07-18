import { Request, Response, NextFunction } from 'express';
enum Role {
    User = 'user',
    Admin = 'admin',
  }
function authenticateAdmin(req: Request, res: Response, next: NextFunction) {
    if (req.user && req.user.role === Role.Admin) {
      next();
    } else {
      res.status(403).send('Access denied. Admins only.');
    }
  }

export {authenticateAdmin}