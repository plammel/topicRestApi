import { BaseEntity } from './abstract/BaseEntity';
import { IUser, UserRole } from '../types';

export class User extends BaseEntity implements IUser {
  public name: string;
  public email: string;
  public role: UserRole;

  constructor(data: Omit<IUser, 'id' | 'createdAt'>) {
    super();
    this.name = data.name;
    this.email = data.email;
    this.role = data.role;
  }

  public updateProfile(name: string, email: string): void {
    this.name = name;
    this.email = email;
    this.updateTimestamp();
  }

  public changeRole(newRole: UserRole): void {
    this.role = newRole;
    this.updateTimestamp();
  }
}