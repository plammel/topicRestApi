import { ResourceService } from '../../src/services/ResourceService';
import { ResourceRepository } from '../../src/repositories/ResourceRepository';
import { IResource, ResourceType } from '../../src/types';
import { Resource } from '../../src/models/Resource';

// Mock del ResourceRepository
jest.mock('../../src/repositories/ResourceRepository');

describe('ResourceService', () => {
  let resourceService: ResourceService;
  let mockResourceRepository: jest.Mocked<ResourceRepository>;

  // Datos de prueba
  const mockResourceData: IResource = {
    id: '1',
    description: 'Test description',
    topicId: 'topic1',
    type: ResourceType.ARTICLE,
    url: 'https://example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockUpdatedData: Partial<IResource> = {
    description: 'Updated description'
  };

  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
    
    // Crear instancia mockeada del repository
    mockResourceRepository = new ResourceRepository() as jest.Mocked<ResourceRepository>;
    
    // Crear instancia del service con el repository mockeado
    resourceService = new ResourceService(mockResourceRepository);
  });

  describe('createResource', () => {
    it('should create a resource successfully', async () => {
      // Arrange
      mockResourceRepository.create.mockResolvedValue(mockResourceData as Resource);

      // Act
      const result = await resourceService.createResource(mockResourceData);

      // Assert
      expect(mockResourceRepository.create).toHaveBeenCalledWith(mockResourceData);
      expect(mockResourceRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResourceData);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockResourceRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(resourceService.createResource(mockResourceData)).rejects.toThrow('Database error');
      expect(mockResourceRepository.create).toHaveBeenCalledWith(mockResourceData);
    });
  });

  describe('getResourceById', () => {
    it('should return a resource when found', async () => {
      // Arrange
      mockResourceRepository.findById.mockResolvedValue(mockResourceData as Resource);

      // Act
      const result = await resourceService.getResourceById('1');

      // Assert
      expect(mockResourceRepository.findById).toHaveBeenCalledWith('1');
      expect(mockResourceRepository.findById).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResourceData);
    });

    it('should return null when resource is not found', async () => {
      // Arrange
      mockResourceRepository.findById.mockResolvedValue(null);

      // Act
      const result = await resourceService.getResourceById('nonexistent');

      // Assert
      expect(mockResourceRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockResourceRepository.findById.mockRejectedValue(error);

      // Act & Assert
      await expect(resourceService.getResourceById('1')).rejects.toThrow('Database error');
    });
  });

  describe('getResourcesByTopicId', () => {
    it('should return resources for a specific topic', async () => {
      // Arrange
      const mockResources = [mockResourceData, { ...mockResourceData, id: '2' }];
      mockResourceRepository.findByTopicId.mockResolvedValue(mockResources as Resource[]);

      // Act
      const result = await resourceService.getResourcesByTopicId('topic1');

      // Assert
      expect(mockResourceRepository.findByTopicId).toHaveBeenCalledWith('topic1');
      expect(mockResourceRepository.findByTopicId).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResources);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no resources found', async () => {
      // Arrange
      mockResourceRepository.findByTopicId.mockResolvedValue([]);

      // Act
      const result = await resourceService.getResourcesByTopicId('nonexistent');

      // Assert
      expect(mockResourceRepository.findByTopicId).toHaveBeenCalledWith('nonexistent');
      expect(result).toEqual([]);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockResourceRepository.findByTopicId.mockRejectedValue(error);

      // Act & Assert
      await expect(resourceService.getResourcesByTopicId('topic1')).rejects.toThrow('Database error');
    });
  });

  describe('getAllResources', () => {
    it('should return all resources', async () => {
      // Arrange
      const mockResources = [
        mockResourceData,
        { ...mockResourceData, id: '2', topicId: 'topic2' }
      ];
      mockResourceRepository.findAll.mockResolvedValue(mockResources as Resource[]);

      // Act
      const result = await resourceService.getAllResources();

      // Assert
      expect(mockResourceRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockResources);
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no resources exist', async () => {
      // Arrange
      mockResourceRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await resourceService.getAllResources();

      // Assert
      expect(mockResourceRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockResourceRepository.findAll.mockRejectedValue(error);

      // Act & Assert
      await expect(resourceService.getAllResources()).rejects.toThrow('Database error');
    });
  });

  describe('updateResource', () => {
    it('should update a resource successfully', async () => {
      // Arrange
      const updatedResource = { ...mockResourceData, ...mockUpdatedData };
      mockResourceRepository.update.mockResolvedValue(updatedResource as Resource);

      // Act
      const result = await resourceService.updateResource('1', mockUpdatedData);

      // Assert
      expect(mockResourceRepository.update).toHaveBeenCalledWith('1', mockUpdatedData);
      expect(mockResourceRepository.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual(updatedResource);
    });

    it('should return null when resource to update is not found', async () => {
      // Arrange
      mockResourceRepository.update.mockResolvedValue(null);

      // Act
      const result = await resourceService.updateResource('nonexistent', mockUpdatedData);

      // Assert
      expect(mockResourceRepository.update).toHaveBeenCalledWith('nonexistent', mockUpdatedData);
      expect(result).toBeNull();
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockResourceRepository.update.mockRejectedValue(error);

      // Act & Assert
      await expect(resourceService.updateResource('1', mockUpdatedData)).rejects.toThrow('Database error');
    });
  });

  describe('deleteResource', () => {
    it('should delete a resource successfully', async () => {
      // Arrange
      mockResourceRepository.delete.mockResolvedValue(true);

      // Act
      const result = await resourceService.deleteResource('1');

      // Assert
      expect(mockResourceRepository.delete).toHaveBeenCalledWith('1');
      expect(mockResourceRepository.delete).toHaveBeenCalledTimes(1);
      expect(result).toBe(true);
    });

    it('should return false when resource to delete is not found', async () => {
      // Arrange
      mockResourceRepository.delete.mockResolvedValue(false);

      // Act
      const result = await resourceService.deleteResource('nonexistent');

      // Assert
      expect(mockResourceRepository.delete).toHaveBeenCalledWith('nonexistent');
      expect(result).toBe(false);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      const error = new Error('Database error');
      mockResourceRepository.delete.mockRejectedValue(error);

      // Act & Assert
      await expect(resourceService.deleteResource('1')).rejects.toThrow('Database error');
    });
  });
});