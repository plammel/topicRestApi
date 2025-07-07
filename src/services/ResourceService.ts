import { Resource } from 'models/Resource';
import { ResourceRepository } from '../repositories/ResourceRepository';
import { IResource } from '../types';

export class ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async createResource(data: IResource): Promise<IResource> {
    return await this.resourceRepository.create(data as Resource);
  }

  async getResourceById(id: string): Promise<IResource | null> {
    return await this.resourceRepository.findById(id);
  }

  async getResourcesByTopicId(topicId: string): Promise<IResource[]> {
    return await this.resourceRepository.findByTopicId(topicId);
  }

  async getAllResources(): Promise<IResource[]> {
    return await this.resourceRepository.findAll();
  }

  async updateResource(id: string, data: Partial<IResource>): Promise<IResource | null> {
    return await this.resourceRepository.update(id, data);
  }

  async deleteResource(id: string): Promise<boolean> {
    return await this.resourceRepository.delete(id);
  }
}