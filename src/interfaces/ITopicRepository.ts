import { ITopic, ITopicVersion } from '../types';
import { IRepository } from './IRepository';

export interface ITopicRepository extends IRepository<ITopic> {
  findByVersion(originalTopicId: string, version: number): Promise<ITopicVersion | null>;
//   findAllVersions(originalTopicId: string): Promise<ITopicVersion[]>;
//   findLatestVersion(originalTopicId: string): Promise<ITopicVersion | null>;
  findChildren(parentId: string): Promise<ITopic[]>;
//   findByParent(parentId?: string): Promise<ITopic[]>;
  createVersion(topic: ITopic): Promise<ITopicVersion>;
}