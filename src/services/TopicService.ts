import { ITopicRepository } from '../interfaces/ITopicRepository';
import {
  ITopic,
  ITopicHierarchy,
  ITopicPath,
} from '../types';
import { TopicFactory } from '../factories/TopicFactory';
import { ResourceRepository } from '../repositories/ResourceRepository';

export class TopicService {
  constructor(
    private topicRepository: ITopicRepository,
    private resourceRepository: ResourceRepository,
    private topicFactory: TopicFactory
  ) { }

  async createTopic(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITopic> {
    const topic = this.topicFactory.createTopic(data);
    return await this.topicRepository.create(topic);
  }

  async updateTopic(id: string, data: Partial<ITopic>): Promise<ITopic | null> {
    const existingTopic = await this.topicRepository.findById(id);
    if (!existingTopic) return null;

    // Create version before updating
    await this.topicRepository.createVersion(existingTopic);

    // Update the topic with new version number
    const updatedData = { ...data, version: existingTopic.version + 1 };
    return await this.topicRepository.update(id, updatedData);
  }

  async getTopicHierarchy(topicId: string): Promise<ITopicHierarchy | null> {
    const topic = await this.topicRepository.findById(topicId);
    if (!topic) return null;

    return await this.buildTopicHierarchy(topic);
  }

  private async buildTopicHierarchy(topic: ITopic): Promise<ITopicHierarchy> {
    const children = await this.topicRepository.findChildren(topic.id!);
    const resources = await this.resourceRepository.findByTopicId(topic.id!);

    const childHierarchies = await Promise.all(
      children.map(child => this.buildTopicHierarchy(child))
    );

    return {
      topic,
      children: childHierarchies,
      resources
    };
  }

  public async findShortestPath(sourceId: string, targetId: string) {
    const topicPath: ITopicPath = {
      sourceTopicId: sourceId,
      targetTopicId: targetId,
      path: [],
      distance: -1
    }

    if (sourceId === targetId) {
      topicPath.path.push(sourceId)
      topicPath.distance = 0
      return topicPath;
    }

    const sourceTopic = await this.getTopicById(sourceId)
    const targetTopic = await this.getTopicById(targetId)

    if (!sourceTopic || !targetTopic) {
      return topicPath;
    }

    let sourcePath = await this.getNodePathToRoot(sourceTopic);
    let targetPath = await this.getNodePathToRoot(targetTopic);

    sourcePath.unshift(sourceId);
    targetPath.unshift(targetId);

    if (sourcePath[sourcePath.length - 1] !== targetPath[targetPath.length - 1]) {
      return topicPath;
    }

    let lcaIndex = -1;

    for (let i = sourcePath.length - 1; i >= 0; i--) {
      const sourceNode = sourcePath[i];
      const targetIndex = targetPath.indexOf(sourceNode);

      if (targetIndex !== -1) {
        lcaIndex = i;
        break;
      }
    }

    if (lcaIndex === -1) {
      return topicPath;
    }

    const lcaNodeId = sourcePath[lcaIndex];
    const targetLcaIndex = targetPath.indexOf(lcaNodeId);

    const pathToLCA = sourcePath.slice(0, lcaIndex + 1);
    const pathFromLCAToTarget = targetPath.slice(0, targetLcaIndex).reverse();

    topicPath.path = pathToLCA.concat(pathFromLCAToTarget);
    topicPath.distance = topicPath.path.length - 1;

    return topicPath;
  }

  private async getNodePathToRoot(node: ITopic): Promise<string[]> {
    let nextParentId = node.parentTopicId;
    let currentNode: ITopic | null = node;
    let path: string[] = []

    while (nextParentId) {
      currentNode = await this.getTopicById(nextParentId)
      if (!currentNode) {
        break;
      }

      path.push(currentNode.id!)
      nextParentId = currentNode.parentTopicId
    }

    return path;
  }

  async getTopicVersion(topicId: string, version: number): Promise<ITopic | null> {
    return await this.topicRepository.findByVersion(topicId, version);
  }

  async getAllTopics(): Promise<ITopic[]> {
    return await this.topicRepository.findAll();
  }

  async getTopicById(id: string): Promise<ITopic | null> {
    return await this.topicRepository.findById(id);
  }

  async deleteTopic(id: string): Promise<boolean> {
    return await this.topicRepository.delete(id);
  }
}