import { UserRole } from '../types';

export interface IPermissionStrategy {
  canRead(): boolean;
  canWrite(): boolean;
  canDelete(): boolean;
  canManageUsers(): boolean;
}