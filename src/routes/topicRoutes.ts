import { Router } from 'express';
import { TopicController } from '../controllers/TopicController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { 
  createTopicSchema, 
  updateTopicSchema, 
} from '../validators/schemas';

export const createTopicRoutes = (topicController: TopicController): Router => {
  const router = Router();
  router.post(
    '/',
    authenticate,
    authorize('write'),
    validateRequest(createTopicSchema),
    topicController.createTopic
  );
  
  router.get(
    '/',
    authenticate,
    authorize('read'),
    topicController.getAllTopics
  );
  
  router.get(
    '/:id',
    authenticate,
    authorize('read'),
    topicController.getTopicById
  );

  router.get(
    '/:id/versions/:version',
    authenticate,
    authorize('read'),
    topicController.getTopicVersion
  );
  
  router.put(
    '/:id',
    authenticate,
    authorize('write'),
      validateRequest(updateTopicSchema),
    topicController.updateTopic
  );
  
  //TODO: delete older versions too. impeed deletion if topic has children 
  router.delete(
    '/:id',
    authenticate,
    authorize('delete'),
    topicController.deleteTopic
  );

  router.get(
    '/:id/hierarchy',
    authenticate,
    authorize('read'),
    topicController.getTopicHierarchy
  );

  router.get(
    '/path/:sourceId/:targetId',
    authenticate,
    authorize('read'),
    topicController.findShortestPath
  );

  return router;
};