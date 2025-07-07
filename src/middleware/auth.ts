import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types';
import { PermissionContext } from '../strategies/PermissionStrategy';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      id: string;
      role: UserRole;
    };
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
    return;
  }
};

export const authorize = (requiredPermission: 'read' | 'write' | 'delete' | 'manageUsers') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    const permissions = new PermissionContext(req.user.role);
    
    let hasPermission = false;
    switch (requiredPermission) {
      case 'read':
        hasPermission = permissions.canRead();
        break;
      case 'write':
        hasPermission = permissions.canWrite();
        break;
      case 'delete':
        hasPermission = permissions.canDelete();
        break;
      case 'manageUsers':
        hasPermission = permissions.canManageUsers();
        break;
    }

    if (!hasPermission) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};