import { Request, Response, NextFunction } from 'express';
import { TopicService } from '../services/TopicService';

export class TopicController {
  constructor(private topicService: TopicService) {}

  createTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topic = await this.topicService.createTopic(req.body);
      res.status(201).json(topic);
    } catch (error) {
      next(error);
    }
  };

  getAllTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topics = await this.topicService.getAllTopics();
      res.json(topics);
    } catch (error) {
      next(error);
    }
  };

  getTopicById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topic = await this.topicService.getTopicById(req.params.id);
      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }
      res.json(topic);
    } catch (error) {
      next(error);
    }
  };

  updateTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topic = await this.topicService.updateTopic(req.params.id, req.body);
      if (!topic) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }
      res.json(topic);
    } catch (error) {
      next(error);
    }
  };

  deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const success = await this.topicService.deleteTopic(req.params.id);
      if (!success) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getTopicHierarchy = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hierarchy = await this.topicService.getTopicHierarchy(req.params.id);
      if (!hierarchy) {
        res.status(404).json({ error: 'Topic not found' });
        return;
      }
      res.json(hierarchy);
    } catch (error) {
      next(error);
    }
  };

  getTopicVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const version = await this.topicService.getTopicVersion(
        req.params.id,
        parseInt(req.params.version, 10)
      );
      if (!version) {
        res.status(404).json({ error: 'Topic version not found' });
        return;
      }
      res.json(version);
    } catch (error) {
      next(error);
    }
  };


  findShortestPath = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const path = await this.topicService.findShortestPath(
        req.params.sourceId,
        req.params.targetId
      );
      if (!path) {
        res.status(404).json({ error: 'No path found between topics' });
        return;
      }
      res.json(path);
    } catch (error) {
      next(error);
    }
  };

}
