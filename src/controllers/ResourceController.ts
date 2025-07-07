import { Request, Response, NextFunction } from 'express';
import { ResourceService } from '../services/ResourceService';

export class ResourceController {
  constructor(private resourceService: ResourceService) {}

  createResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await this.resourceService.createResource(req.body);
      res.status(201).json(resource);
    } catch (error) {
      next(error);
    }
  };

  getAllResources = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resources = await this.resourceService.getAllResources();
      res.json(resources);
    } catch (error) {
      next(error);
    }
  };

  getResourceById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await this.resourceService.getResourceById(req.params.id);
      if (!resource) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
      res.json(resource);
    } catch (error) {
      next(error);
    }
  };

  getResourcesByTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resources = await this.resourceService.getResourcesByTopicId(req.params.topicId);
      res.json(resources);
    } catch (error) {
      next(error);
    }
  };

  updateResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resource = await this.resourceService.updateResource(req.params.id, req.body);
      if (!resource) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
      res.json(resource);
    } catch (error) {
      next(error);
    }
  };

  deleteResource = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await this.resourceService.deleteResource(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}