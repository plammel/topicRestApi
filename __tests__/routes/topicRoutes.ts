
// topicRoutes.test.ts
import request from 'supertest';
import express, { Request, Response } from 'express';
import { createTopicRoutes } from '../../src/routes/topicRoutes';
import { TopicController } from '../../src/controllers/TopicController';
import { authenticate, authorize } from '../../src/middleware/auth';
import { validateRequest } from '../../src/middleware/validation';

jest.mock('../../src/controllers/TopicController');
jest.mock('../../src/middleware/auth');
jest.mock('../../src/middleware/validation');

describe('Topic Routes', () => {
  let app: express.Application;
  let mockTopicController: jest.Mocked<TopicController>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTopicController = {
      createTopic: jest.fn(),
      getAllTopics: jest.fn(),
      getTopicById: jest.fn(),
      getTopicVersion: jest.fn(),
      updateTopic: jest.fn(),
      deleteTopic: jest.fn(),
      getTopicHierarchy: jest.fn(),
      findShortestPath: jest.fn()
    } as any;

    (authenticate as jest.Mock).mockImplementation((req, res, next) => next());
    (authorize as jest.Mock).mockImplementation(() => (req, res, next) => next());
    (validateRequest as jest.Mock).mockImplementation(() => (req, res, next) => next());

    app = express();
    app.use(express.json());
    app.use('/topics', createTopicRoutes(mockTopicController));
  });

  describe('POST /', () => {
    it('should create a topic with proper middleware', async () => {
      mockTopicController.createTopic.mockImplementation((req: Request, res: Response): any => {
        res.status(201).json({ id: '1', title: 'Test Topic' });
      });

      const response = await request(app)
        .post('/topics/')
        .send({ title: 'Test Topic', description: 'Test' });

      expect(response.status).toBe(201);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('write');
      expect(validateRequest).toHaveBeenCalled();
      expect(mockTopicController.createTopic).toHaveBeenCalled();
    });
  });

  describe('GET /', () => {
    it('should get all topics with proper middleware', async () => {
      mockTopicController.getAllTopics.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json([{ id: '1', title: 'Topic 1' }]);
      });

      const response = await request(app).get('/topics/');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockTopicController.getAllTopics).toHaveBeenCalled();
    });
  });

  describe('GET /:id', () => {
    it('should get topic by id with proper middleware', async () => {
      mockTopicController.getTopicById.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ id: req.params.id, title: 'Topic 1' });
      });

      const response = await request(app).get('/topics/1');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockTopicController.getTopicById).toHaveBeenCalled();
    });
  });

  describe('GET /:id/versions/:version', () => {
    it('should get topic version with proper middleware', async () => {
      mockTopicController.getTopicVersion.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ id: req.params.id, version: req.params.version });
      });

      const response = await request(app).get('/topics/1/versions/2');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockTopicController.getTopicVersion).toHaveBeenCalled();
    });
  });

  describe('PUT /:id', () => {
    it('should update topic with proper middleware', async () => {
      mockTopicController.updateTopic.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ id: req.params.id, title: 'Updated Topic' });
      });

      const response = await request(app)
        .put('/topics/1')
        .send({ title: 'Updated Topic' });

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('write');
      expect(validateRequest).toHaveBeenCalled();
      expect(mockTopicController.updateTopic).toHaveBeenCalled();
    });
  });

  describe('DELETE /:id', () => {
    it('should delete topic with proper middleware', async () => {
      mockTopicController.deleteTopic.mockImplementation((req: Request, res: Response): any => {
        res.status(204).send();
      });

      const response = await request(app).delete('/topics/1');

      expect(response.status).toBe(204);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('delete');
      expect(mockTopicController.deleteTopic).toHaveBeenCalled();
    });
  });

  describe('GET /:id/hierarchy', () => {
    it('should get topic hierarchy with proper middleware', async () => {
      mockTopicController.getTopicHierarchy.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({
          topic: { id: req.params.id, title: 'Root Topic' },
          children: [],
          resources: []
        });
      });

      const response = await request(app).get('/topics/1/hierarchy');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockTopicController.getTopicHierarchy).toHaveBeenCalled();
    });
  });

  describe('GET /path/:sourceId/:targetId', () => {
    it('should find shortest path with proper middleware', async () => {
      mockTopicController.findShortestPath.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({
          sourceTopicId: req.params.sourceId,
          targetTopicId: req.params.targetId,
          path: ['1', '2'],
          distance: 1
        });
      });

      const response = await request(app).get('/topics/path/1/2');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockTopicController.findShortestPath).toHaveBeenCalled();
    });
  });
});
