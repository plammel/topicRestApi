import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createUserSchema } from '../validators/schemas';

export const createUserRoutes = (userController: UserController): Router => {
  const router = Router();

  router.post('/login', userController.login);

  router.post(
    '/',
    authenticate,
    authorize('manageUsers'),
    validateRequest(createUserSchema),
    userController.createUser
  );

  router.get(
    '/',
    authenticate,
    authorize('manageUsers'),
    userController.getAllUsers
  );

  router.get(
    '/:id',
    authenticate,
    authorize('read'),
    userController.getUserById
  );

  router.put(
    '/:id',
    authenticate,
    authorize('manageUsers'),
    userController.updateUser
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('manageUsers'),
    userController.deleteUser
  );

  return router;
};