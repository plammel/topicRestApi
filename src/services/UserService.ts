import { User } from 'models/User';
import { UserRepository } from '../repositories/UserRepository';
import { IUser } from '../types';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: Omit<IUser, 'id' | 'createdAt'>): Promise<IUser> {
    return await this.userRepository.create(data as User);
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await this.userRepository.findByEmail(email);
  }

  async getAllUsers(): Promise<IUser[]> {
    return await this.userRepository.findAll();
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<boolean> {
    return await this.userRepository.delete(id);
  }
}