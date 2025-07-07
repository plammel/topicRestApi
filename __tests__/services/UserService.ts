import { UserService } from '../../src/services/UserService';
import { UserRepository } from '../../src/repositories/UserRepository';
import { IUser, UserRole } from '../../src/types';
import { User } from '../../src/models/User';

jest.mock('../../src/repositories/UserRepository');

describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;

  const mockUserData: IUser = {
    id: '1',
    email: 'test@example.com',
    name: 'testuser',
    role: UserRole.ADMIN,
    createdAt: new Date('2024-01-01'),
  };

  const mockCreateUserData: Omit<IUser, 'id' | 'createdAt'> = {
    email: 'new@example.com',
    name: 'newuser',
    role: UserRole.ADMIN,
  };

  const mockUpdatedData: Partial<IUser> = {
    name: 'updated user'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService(mockUserRepository);
  });

  describe('createUser', () => {
    it('should create a user successfully', async () => {
      // Arrange
      const expectedUser = { ...mockCreateUserData, id: '2', createdAt: new Date() };
      mockUserRepository.create.mockResolvedValue(expectedUser as User);

      // Act
      const result = await userService.createUser(mockCreateUserData);

      // Assert
      expect(mockUserRepository.create).toHaveBeenCalledWith(mockCreateUserData);
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.createUser(mockCreateUserData)).rejects.toThrow('Database error');
      expect(mockUserRepository.create).toHaveBeenCalledWith(mockCreateUserData);
    });

    it('should handle email validation errors', async () => {
      // Arrange
      const invalidUserData = { ...mockCreateUserData, email: 'invalid-email' };
      const error = new Error('Invalid email format');
      mockUserRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.createUser(invalidUserData)).rejects.toThrow('Invalid email format');
    });
  });

  describe('getUserById', () => {
    it('should return a user when found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(mockUserData as User);

      // Act
      const result = await userService.getUserById('1');

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserData);
    });

    it('should return null when user is not found', async () => {
      // Arrange
      mockUserRepository.findById.mockResolvedValue(null);

      // Act
      const result = await userService.getUserById('nonexistent');

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.getUserById('1')).rejects.toThrow('Database error');
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user when found by email', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockUserData as User);

      // Act
      const result = await userService.getUserByEmail('test@example.com');

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUserData);
    });

    it('should return null when user is not found by email', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act
      const result = await userService.getUserByEmail('nonexistent@example.com');

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('nonexistent@example.com');
      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.findByEmail.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.getUserByEmail('test@example.com')).rejects.toThrow('Database error');
    });

    it('should handle case-insensitive email search', async () => {
      // Arrange
      mockUserRepository.findByEmail.mockResolvedValue(mockUserData as User);

      // Act
      const result = await userService.getUserByEmail('TEST@EXAMPLE.COM');

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('TEST@EXAMPLE.COM');
      expect(result).toEqual(mockUserData);
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      // Arrange
      const mockUsers = [
        mockUserData,
        { ...mockUserData, id: '2', email: 'user2@example.com' }
      ];
      mockUserRepository.findAll.mockResolvedValue(mockUsers as User[]);

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      mockUserRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await userService.getAllUsers();

      // Assert
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.getAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      // Arrange
      const updatedUser = { ...mockUserData, ...mockUpdatedData, updatedAt: new Date() };
      mockUserRepository.update.mockResolvedValue(updatedUser as User);

      // Act
      const result = await userService.updateUser('1', mockUpdatedData);

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', mockUpdatedData);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user to update is not found', async () => {
      // Arrange
      mockUserRepository.update.mockResolvedValue(null);

      // Act
      const result = await userService.updateUser('nonexistent', mockUpdatedData);

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith('nonexistent', mockUpdatedData);
      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.updateUser('1', mockUpdatedData)).rejects.toThrow('Database error');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      // Arrange
      mockUserRepository.delete.mockResolvedValue(true);

      // Act
      const result = await userService.deleteUser('1');

      // Assert
      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
      expect(mockUserRepository.delete).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when user to delete is not found', async () => {
      // Arrange
      mockUserRepository.delete.mockResolvedValue(false);

      // Act
      const result = await userService.deleteUser('nonexistent');

      // Assert
      expect(mockUserRepository.delete).toHaveBeenCalledWith('nonexistent');
      expect(result).toBe(false);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockUserRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(userService.deleteUser('1')).rejects.toThrow('Database error');
    });
  });
});