import { BaseEntity } from './abstract/BaseEntity';
import { IResource, ResourceType } from '../types';

export class Resource extends BaseEntity implements IResource {
  public topicId: string;
  public url: string;
  public description: string;
  public type: ResourceType;

  constructor(data: Omit<IResource, 'id' | 'createdAt' | 'updatedAt'>) {
    super();
    this.topicId = data.topicId;
    this.url = data.url;
    this.description = data.description;
    this.type = data.type;
  }

  public updateResource(url: string, description: string, type: ResourceType): void {
    this.url = url;
    this.description = description;
    this.type = type;
    this.updateTimestamp();
  }
}