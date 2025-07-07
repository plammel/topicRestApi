import { IRepository } from '../interfaces/IRepository';
import { BaseEntity } from '../models/abstract/BaseEntity';
import { v4 as uuidv4 } from 'uuid';

export abstract class InMemoryRepository<T extends BaseEntity> implements IRepository<T> {
  protected data: Map<string, T> = new Map();

  async create(entityData: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const entity = this.createEntity(entityData);
    this.data.set(entity.id, entity);
    return entity;
  }

  async findById(id: string): Promise<T | null> {
    return this.data.get(id) || null;
  }

  async findAll(): Promise<T[]> {
    return Array.from(this.data.values());
  }

  async update(id: string, entityData: Partial<T>): Promise<T | null> {
    const entity = this.data.get(id);
    if (!entity) return null;

    Object.assign(entity, entityData);
    entity.updatedAt = new Date();
    this.data.set(id, entity);
    return entity;
  }

  async delete(id: string): Promise<boolean> {
    return this.data.delete(id);
  }

  protected abstract createEntity(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): T;
}