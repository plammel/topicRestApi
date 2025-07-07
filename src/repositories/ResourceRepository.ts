import { Resource } from '../models/Resource';
import { IResource } from '../types';
import { InMemoryRepository } from './InMemoryRepository';

export class ResourceRepository extends InMemoryRepository<Resource> {
  protected createEntity(data: Omit<IResource, 'id' | 'createdAt' | 'updatedAt'>): Resource {
    return new Resource(data);
  }

  async findByTopicId(topicId: string): Promise<Resource[]> {
    const resources = await this.findAll();
    return resources.filter(resource => resource.topicId === topicId);
  }
}