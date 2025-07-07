import request from 'supertest';
import express, { Request, Response } from 'express';
import { createUserRoutes } from '../../src/routes/userRoutes';
import { UserController } from '../../src/controllers/UserController';
import { authenticate, authorize } from '../../src/middleware/auth';
import { validateRequest } from '../../src/middleware/validation';

jest.mock('../../src/controllers/UserController');
jest.mock('../../src/middleware/auth');
jest.mock('../../src/middleware/validation');

describe('User Routes', () => {
  let app: express.Application;
  let mockUserController: jest.Mocked<UserController>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockUserController = {
      login: jest.fn(),
      createUser: jest.fn(),
      getAllUsers: jest.fn(),
      getUserById: jest.fn(),
      updateUser: jest.fn(),
      deleteUser: jest.fn()
    } as any;

    (authenticate as jest.Mock).mockImplementation((req, res, next) => next());
    (authorize as jest.Mock).mockImplementation(() => (req, res, next) => next());
    (validateRequest as jest.Mock).mockImplementation(() => (req, res, next) => next());

    app = express();
    app.use(express.json());
    app.use('/users', createUserRoutes(mockUserController));
  });

  describe('POST /login', () => {
    it('should login without authentication middleware', async () => {
      mockUserController.login.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ token: 'jwt-token', user: { id: '1' } });
      });

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(mockUserController.login).toHaveBeenCalled();
    });

    it('should handle login errors', async () => {
      mockUserController.login.mockImplementation((req: Request, res: Response): any => {
        res.status(401).json({ error: 'Invalid credentials' });
      });

      const response = await request(app)
        .post('/users/login')
        .send({ email: 'test@example.com', password: 'wrong' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /', () => {
    it('should create a user with proper middleware', async () => {
      mockUserController.createUser.mockImplementation((req: Request, res: Response): any => {
        res.status(201).json({ id: '1', email: 'test@example.com' });
      });

      const response = await request(app)
        .post('/users/')
        .send({ email: 'test@example.com', username: 'testuser' });

      expect(response.status).toBe(201);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('manageUsers');
      expect(validateRequest).toHaveBeenCalled();
      expect(mockUserController.createUser).toHaveBeenCalled();
    });

  });

  describe('GET /', () => {
    it('should get all users with proper middleware', async () => {
      mockUserController.getAllUsers.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json([{ id: '1', email: 'user1@example.com' }]);
      });

      const response = await request(app).get('/users/');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('manageUsers');
      expect(mockUserController.getAllUsers).toHaveBeenCalled();
    });
  });

  describe('GET /:id', () => {
    it('should get user by id with proper middleware', async () => {
      mockUserController.getUserById.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ id: req.params.id, email: 'user@example.com' });
      });

      const response = await request(app).get('/users/1');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockUserController.getUserById).toHaveBeenCalled();
    });
  });

  describe('PUT /:id', () => {
    it('should update user with proper middleware', async () => {
      mockUserController.updateUser.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ id: req.params.id, email: 'updated@example.com' });
      });

      const response = await request(app)
        .put('/users/1')
        .send({ email: 'updated@example.com' });

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('manageUsers');
      expect(mockUserController.updateUser).toHaveBeenCalled();
    });
  });

  describe('DELETE /:id', () => {
    it('should delete user with proper middleware', async () => {
      mockUserController.deleteUser.mockImplementation((req: Request, res: Response): any => {
        res.status(204).send();
      });

      const response = await request(app).delete('/users/1');

      expect(response.status).toBe(204);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('manageUsers');
      expect(mockUserController.deleteUser).toHaveBeenCalled();
    });
  });
});
