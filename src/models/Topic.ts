import { BaseEntity } from './abstract/BaseEntity';
import { ITopic, ITopicComponent, ITopicVisitor } from '../types';

export class Topic extends BaseEntity implements ITopic, ITopicComponent {
  public name: string;
  public content: string;
  public version: number;
  public parentTopicId?: string;
  private children: ITopicComponent[] = [];

  constructor(data: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt'>) {
    super();
    this.name = data.name;
    this.content = data.content;
    this.version = data.version || 1;
    this.parentTopicId = data.parentTopicId;
  }

  public updateContent(content: string): void {
    this.content = content;
    this.version += 1;
    this.updateTimestamp();
  }

  public updateName(name: string): void {
    this.name = name;
    this.updateTimestamp();
  }

  public setParent(parentId: string): void {
    this.parentTopicId = parentId;
    this.updateTimestamp();
  }

  // Composite Pattern Implementation
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getContent(): string {
    return this.content;
  }

  public getChildren(): ITopicComponent[] {
    return [...this.children];
  }

  public addChild(child: ITopicComponent): void {
    this.children.push(child);
  }

  public removeChild(childId: string): void {
    this.children = this.children.filter(child => child.getId() !== childId);
  }

  public accept(visitor: ITopicVisitor): void {
    visitor.visitTopic(this);
    this.children.forEach(child => child.accept(visitor));
  }
}