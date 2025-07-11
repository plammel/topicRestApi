import { Topic } from '../models/Topic';
import { TopicVersion } from '../models/TopicVersion';
import { ITopicRepository } from '../interfaces/ITopicRepository';
import { ITopic, ITopicVersion } from '../types';
import { InMemoryRepository } from './InMemoryRepository';

export class TopicRepository extends InMemoryRepository<Topic> implements ITopicRepository {
  private versionData: Map<string, TopicVersion[]> = new Map();

  protected createEntity(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt'>): Topic {
    return new Topic(data);
  }

  async findByVersion(originalTopicId: string, version: number): Promise<ITopicVersion | null> {
    const versions = this.versionData.get(originalTopicId) || [];
    return versions.find(v => v.version === version) || null;
  }

  async findChildren(parentId: string): Promise<ITopic[]> {
    const allTopics = await this.findAll();
    return allTopics.filter(topic => topic.parentTopicId === parentId);
  }

  async createVersion(topic: ITopic): Promise<ITopicVersion> {
    const versions = this.versionData.get(topic.id!) || [];
    
    // Mark all existing versions as not latest
    versions.forEach(v => v.markAsOld());
    
    // Create new version
    const newVersion = new TopicVersion(topic, true);
    versions.push(newVersion);
    
    this.versionData.set(topic.id!, versions);
    return newVersion;
  }
}
