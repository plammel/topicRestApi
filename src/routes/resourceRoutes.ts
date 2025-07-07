import { Router } from 'express';
import { ResourceController } from '../controllers/ResourceController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createResourceSchema } from '../validators/schemas';

export const createResourceRoutes = (resourceController: ResourceController): Router => {
  const router = Router();

  router.post(
    '/',
    authenticate,
    authorize('write'),
    validateRequest(createResourceSchema),
    resourceController.createResource
  );

  router.get(
    '/',
    authenticate,
    authorize('read'),
    resourceController.getAllResources
  );

  router.get(
    '/:id',
    authenticate,
    authorize('read'),
    resourceController.getResourceById
  );

  router.get(
    '/topic/:topicId',
    authenticate,
    authorize('read'),
    resourceController.getResourcesByTopic
  );

  router.put(
    '/:id',
    authenticate,
    authorize('write'),
    resourceController.updateResource
  );

  router.delete(
    '/:id',
    authenticate,
    authorize('delete'),
    resourceController.deleteResource
  );

  return router;
};