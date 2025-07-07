import { User } from '../models/User';
import { IUser } from '../types';
import { InMemoryRepository } from './InMemoryRepository';

export class UserRepository extends InMemoryRepository<User> {
  protected createEntity(data: Omit<IUser, 'id' | 'createdAt'>): User {
    return new User(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.findAll();
    return users.find(user => user.email === email) || null;
  }
}