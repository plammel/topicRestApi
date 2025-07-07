// resourceRoutes.test.ts
import request from 'supertest';
import express, { Request, Response } from 'express';
import { createResourceRoutes } from '../../src/routes/resourceRoutes';
import { ResourceController } from '../../src/controllers/ResourceController';
import { authenticate, authorize } from '../../src/middleware/auth';
import { validateRequest } from '../../src/middleware/validation';

jest.mock('../../src/controllers/ResourceController');
jest.mock('../../src/middleware/auth');
jest.mock('../../src/middleware/validation');

describe('Resource Routes', () => {
  let app: express.Application;
  let mockResourceController: jest.Mocked<ResourceController>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockResourceController = {
      createResource: jest.fn(),
      getAllResources: jest.fn(),
      getResourceById: jest.fn(),
      getResourcesByTopic: jest.fn(),
      updateResource: jest.fn(),
      deleteResource: jest.fn()
    } as any;

    (authenticate as jest.Mock).mockImplementation((req, res, next) => next());
    (authorize as jest.Mock).mockImplementation(() => (req, res, next) => next());
    (validateRequest as jest.Mock).mockImplementation(() => (req, res, next) => next());

    app = express();
    app.use(express.json());
    app.use('/resources', createResourceRoutes(mockResourceController));
  });

  describe('POST /', () => {
    it('should create a resource with proper middleware', async () => {
      mockResourceController.createResource.mockImplementation((req: Request, res: Response): any => {
        res.status(201).json({ id: '1', title: 'Test Resource' });
      });

      const response = await request(app)
        .post('/resources/')
        .send({ title: 'Test Resource', description: 'Test' });

      expect(response.status).toBe(201);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('write');
      expect(validateRequest).toHaveBeenCalled();
      expect(mockResourceController.createResource).toHaveBeenCalled();
    });

    it('should reject unauthorized requests', async () => {
      (authenticate as jest.Mock).mockImplementation((req, res, next) => {
        res.status(401).json({ error: 'Unauthorized' });
      });

      const response = await request(app)
        .post('/resources/')
        .send({ title: 'Test Resource' });

      expect(response.status).toBe(401);
      expect(mockResourceController.createResource).not.toHaveBeenCalled();
    });
  });

  describe('GET /', () => {
    it('should get all resources with proper middleware', async () => {
      mockResourceController.getAllResources.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json([{ id: '1', title: 'Resource 1' }]);
      });

      const response = await request(app).get('/resources/');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockResourceController.getAllResources).toHaveBeenCalled();
    });
  });

  describe('GET /:id', () => {
    it('should get resource by id with proper middleware', async () => {
      mockResourceController.getResourceById.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ id: req.params.id, title: 'Resource 1' });
      });

      const response = await request(app).get('/resources/1');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockResourceController.getResourceById).toHaveBeenCalled();
    });
  });

  describe('GET /topic/:topicId', () => {
    it('should get resources by topic with proper middleware', async () => {
      mockResourceController.getResourcesByTopic.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json([{ id: '1', topicId: req.params.topicId }]);
      });

      const response = await request(app).get('/resources/topic/topic1');

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('read');
      expect(mockResourceController.getResourcesByTopic).toHaveBeenCalled();
    });
  });

  describe('PUT /:id', () => {
    it('should update resource with proper middleware', async () => {
      mockResourceController.updateResource.mockImplementation((req: Request, res: Response): any => {
        res.status(200).json({ id: req.params.id, title: 'Updated Resource' });
      });

      const response = await request(app)
        .put('/resources/1')
        .send({ title: 'Updated Resource' });

      expect(response.status).toBe(200);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('write');
      expect(mockResourceController.updateResource).toHaveBeenCalled();
    });
  });

  describe('DELETE /:id', () => {
    it('should delete resource with proper middleware', async () => {
      mockResourceController.deleteResource.mockImplementation((req: Request, res: Response): any => {
        res.status(204).send();
      });

      const response = await request(app).delete('/resources/1');

      expect(response.status).toBe(204);
      expect(authenticate).toHaveBeenCalled();
      expect(authorize).toHaveBeenCalledWith('delete');
      expect(mockResourceController.deleteResource).toHaveBeenCalled();
    });
  });
});
