import { IPermissionStrategy } from '../interfaces/IPermissionStrategy';
import { UserRole } from '../types';

export class AdminPermissionStrategy implements IPermissionStrategy {
  canRead(): boolean { return true; }
  canWrite(): boolean { return true; }
  canDelete(): boolean { return true; }
  canManageUsers(): boolean { return true; }
}

export class EditorPermissionStrategy implements IPermissionStrategy {
  canRead(): boolean { return true; }
  canWrite(): boolean { return true; }
  canDelete(): boolean { return false; }
  canManageUsers(): boolean { return false; }
}

export class ViewerPermissionStrategy implements IPermissionStrategy {
  canRead(): boolean { return true; }
  canWrite(): boolean { return false; }
  canDelete(): boolean { return false; }
  canManageUsers(): boolean { return false; }
}

export class PermissionContext {
  private strategy: IPermissionStrategy;

  constructor(role: UserRole) {
    this.setStrategy(role);
  }

  private setStrategy(role: UserRole): void {
    switch (role) {
      case UserRole.ADMIN:
        this.strategy = new AdminPermissionStrategy();
        break;
      case UserRole.EDITOR:
        this.strategy = new EditorPermissionStrategy();
        break;
      case UserRole.VIEWER:
        this.strategy = new ViewerPermissionStrategy();
        break;
      default:
        this.strategy = new ViewerPermissionStrategy();
    }
  }

  public canRead(): boolean {
    return this.strategy.canRead();
  }

  public canWrite(): boolean {
    return this.strategy.canWrite();
  }

  public canDelete(): boolean {
    return this.strategy.canDelete();
  }

  public canManageUsers(): boolean {
    return this.strategy.canManageUsers();
  }
}