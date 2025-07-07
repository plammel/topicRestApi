export enum UserRole {
  ADMIN = 'Admin',
  EDITOR = 'Editor',
  VIEWER = 'Viewer'
}

export enum ResourceType {
  VIDEO = 'video',
  ARTICLE = 'article',
  PDF = 'pdf',
  DOCUMENT = 'document'
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export interface ITopic {
  id?: string;
  name: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  version: number;
  parentTopicId?: string;
}

export interface IResource {
  id: string;
  topicId: string;
  url: string;
  description: string;
  type: ResourceType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopicVersion extends ITopic {
  originalTopicId: string;
  isLatest: boolean;
}

export interface ITopicHierarchy {
  topic: ITopic;
  children: ITopicHierarchy[];
  resources: IResource[];
}

export interface ITopicPath {
  sourceTopicId: string;
  targetTopicId: string;
  distance: number;
  path: string[];
}

export interface ITopicComponent {
  getId(): string;
  getName(): string;
  getContent(): string;
  getChildren(): ITopicComponent[];
  addChild(child: ITopicComponent): void;
  removeChild(childId: string): void;
  accept(visitor: ITopicVisitor): void;
}

export interface ITopicVisitor {
  visitTopic(topic: ITopicComponent): void;
  visitComposite(composite: ITopicComponent): void;
}