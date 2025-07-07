import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/UserService';
import jwt from 'jsonwebtoken';

export class UserController {
  constructor(private userService: UserService) {}

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.updateUser(req.params.id, req.body);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }
      res.json(user);
    } catch (error) {
      next(error);
    }
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await this.userService.deleteUser(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await this.userService.getUserByEmail(email);
      
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET || 'secret',
        { expiresIn: '24h' }
      );

      res.json({ token, user });
    } catch (error) {
      next(error);
    }
  };
}