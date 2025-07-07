import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { TopicRepository } from './repositories/TopicRepository';
import { UserRepository } from './repositories/UserRepository';
import { ResourceRepository } from './repositories/ResourceRepository';
import { TopicService } from './services/TopicService';
import { UserService } from './services/UserService';
import { ResourceService } from './services/ResourceService';
import { TopicController } from './controllers/TopicController';
import { UserController } from './controllers/UserController';
import { StandardTopicFactory } from './factories/TopicFactory';
import { createTopicRoutes } from './routes/topicRoutes';
import { createUserRoutes } from './routes/userRoutes';
import { createResourceRoutes } from './routes/resourceRoutes';
import { ResourceController } from './controllers/ResourceController';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

class App {
  public app: express.Application;
  private topicRepository: TopicRepository;
  private userRepository: UserRepository;
  private resourceRepository: ResourceRepository;
  private topicFactory: StandardTopicFactory;
  private topicService: TopicService;
  private userService: UserService;
  private resourceService: ResourceService;
  private topicController: TopicController;
  private userController: UserController;
  private resourceController: ResourceController;

  constructor() {
    this.app = express();
    this.initializeRepositories();
    this.initializeServices();
    this.initializeControllers();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeRepositories(): void {
    this.topicRepository = new TopicRepository();
    this.userRepository = new UserRepository();
    this.resourceRepository = new ResourceRepository();
    this.topicFactory = new StandardTopicFactory();
  }

  private initializeServices(): void {
    this.topicService = new TopicService(
      this.topicRepository,
      this.resourceRepository,
      this.topicFactory
    );
    this.userService = new UserService(this.userRepository);
    this.resourceService = new ResourceService(this.resourceRepository);
  }

  private initializeControllers(): void {
    this.topicController = new TopicController(this.topicService);
    this.userController = new UserController(this.userService);
    this.resourceController = new ResourceController(this.resourceService);
  }

  private initializeMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(): void {
    this.app.use('/api/topics', createTopicRoutes(this.topicController));
    this.app.use('/api/users', createUserRoutes(this.userController));
    this.app.use('/api/resources', createResourceRoutes(this.resourceController));
    
    this.app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  public getApp(): express.Application {
    return this.app;
  }
}

export default App;