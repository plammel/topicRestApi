import { TopicService } from '../../src/services/TopicService';
import { ITopicRepository } from '../../src/interfaces/ITopicRepository';
import { ResourceRepository } from '../../src/repositories/ResourceRepository';
import { TopicFactory } from '../../src/factories/TopicFactory';
import { ITopic, ITopicHierarchy, ITopicPath, IResource, ResourceType, ITopicVersion } from '../../src/types';
import { Topic } from '../../src/models/Topic';
import { Resource } from '../../src/models/Resource';

jest.mock('../../src/interfaces/ITopicRepository');
jest.mock('../../src/repositories/ResourceRepository');
jest.mock('../../src/factories/TopicFactory');

describe('TopicService', () => {
  let topicService: TopicService;
  let mockTopicRepository: jest.Mocked<ITopicRepository>;
  let mockResourceRepository: jest.Mocked<ResourceRepository>;
  let mockTopicFactory: jest.Mocked<TopicFactory>;

  const mockTopicData: Omit<ITopic, 'id' | 'createdAt' | 'updatedAt'> = {
    name: 'Test Topic',
    content: 'Test description',
    version: 1
  };

  const mockTopic: ITopic = {
    id: '1',
    name: 'topic 1',
    content: '',
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockChildTopic: ITopic = {
    id: '2',
    name: 'Child Topic',
    content: 'Child description',
    parentTopicId: '1',
    version: 1,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockResource: IResource = {
    id: '1',
    description: 'Test resource description',
    topicId: '1',
    url: 'https://example.com',
    type: ResourceType.ARTICLE,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUpdatedData: Partial<ITopic> = {
    name: 'Updated Topic',
    content: 'Updated description'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockTopicRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findChildren: jest.fn(),
      createVersion: jest.fn(),
      findByVersion: jest.fn()
    } as jest.Mocked<ITopicRepository>;

    mockResourceRepository = {
      findByTopicId: jest.fn()
    } as any;

    mockTopicFactory = {
      createTopic: jest.fn()
    } as any;
    
    topicService = new TopicService(
      mockTopicRepository,
      mockResourceRepository,
      mockTopicFactory
    );
  });

  describe('createTopic', () => {
    it('should create a topic successfully', async () => {
      // Arrange
      mockTopicFactory.createTopic.mockReturnValue(mockTopic as Topic);
      mockTopicRepository.create.mockResolvedValue(mockTopic);

      // Act
      const result = await topicService.createTopic(mockTopicData);

      // Assert
      expect(mockTopicFactory.createTopic).toHaveBeenCalledWith(mockTopicData);
      expect(mockTopicRepository.create).toHaveBeenCalledWith(mockTopic);
      expect(result).toEqual(mockTopic);
    });

    it('should throw error when repository fails', async () => {
      // Arrange
      mockTopicFactory.createTopic.mockReturnValue(mockTopic as Topic);
      const error = new Error('Database error');
      mockTopicRepository.create.mockRejectedValue(error);

      // Act & Assert
      await expect(topicService.createTopic(mockTopicData)).rejects.toThrow('Database error');
    });
  });

  describe('updateTopic', () => {
    it('should update a topic successfully', async () => {
      // Arrange
      mockTopicRepository.findById.mockResolvedValue(mockTopic);
      const updatedTopic = { ...mockTopic, ...mockUpdatedData, version: 2 };
      mockTopicRepository.update.mockResolvedValue(updatedTopic);

      // Act
      const result = await topicService.updateTopic('1', mockUpdatedData);

      // Assert
      expect(mockTopicRepository.findById).toHaveBeenCalledWith('1');
      expect(mockTopicRepository.createVersion).toHaveBeenCalledWith(mockTopic);
      expect(mockTopicRepository.update).toHaveBeenCalledWith('1', { ...mockUpdatedData, version: 2 });
      expect(result).toEqual(updatedTopic);
    });

    it('should return null when topic does not exist', async () => {
      // Arrange
      mockTopicRepository.findById.mockResolvedValue(null);

      // Act
      const result = await topicService.updateTopic('nonexistent', mockUpdatedData);

      // Assert
      expect(mockTopicRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(mockTopicRepository.createVersion).not.toHaveBeenCalled();
      expect(mockTopicRepository.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should increment version number', async () => {
      // Arrange
      const topicWithVersion = { ...mockTopic, version: 5 };
      mockTopicRepository.findById.mockResolvedValue(topicWithVersion);
      const updatedTopic = { ...topicWithVersion, version: 6 };
      mockTopicRepository.update.mockResolvedValue(updatedTopic);

      // Act
      const result = await topicService.updateTopic('1', mockUpdatedData);

      // Assert
      expect(mockTopicRepository.update).toHaveBeenCalledWith('1', { ...mockUpdatedData, version: 6 });
      expect(result?.version).toBe(6);
    });
  });

  describe('getTopicHierarchy', () => {
    it('should return topic hierarchy successfully', async () => {
      // Arrange
      mockTopicRepository.findById.mockResolvedValue(mockTopic);
      mockTopicRepository.findChildren.mockResolvedValue([mockChildTopic]);
      mockResourceRepository.findByTopicId.mockResolvedValue([mockResource] as Resource[]);

      // For child topic
      mockTopicRepository.findChildren.mockResolvedValueOnce([mockChildTopic]);
      mockTopicRepository.findChildren.mockResolvedValueOnce([]);
      mockResourceRepository.findByTopicId.mockResolvedValueOnce([mockResource] as Resource[]);
      mockResourceRepository.findByTopicId.mockResolvedValueOnce([]);

      // Act
      const result = await topicService.getTopicHierarchy('1');

      // Assert
      expect(mockTopicRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toBeDefined();
      expect(result?.topic).toEqual(mockTopic);
      expect(result?.children).toHaveLength(1);
      expect(result?.resources).toEqual([mockResource]);
    });

    it('should return null when topic does not exist', async () => {
      // Arrange
      mockTopicRepository.findById.mockResolvedValue(null);

      // Act
      const result = await topicService.getTopicHierarchy('nonexistent');

      // Assert
      expect(mockTopicRepository.findById).toHaveBeenCalledWith('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('findShortestPath', () => {
    it('should return path with distance 0 for same topic', async () => {
      // Act
      const result = await topicService.findShortestPath('1', '1');

      // Assert
      expect(result.sourceTopicId).toBe('1');
      expect(result.targetTopicId).toBe('1');
      expect(result.path).toEqual(['1']);
      expect(result.distance).toBe(0);
    });

    it('should return empty path when source topic does not exist', async () => {
      // Arrange
      mockTopicRepository.findById.mockResolvedValue(null);

      // Act
      const result = await topicService.findShortestPath('nonexistent', '2');

      // Assert
      expect(result.sourceTopicId).toBe('nonexistent');
      expect(result.targetTopicId).toBe('2');
      expect(result.path).toEqual([]);
      expect(result.distance).toBe(-1);
    });

    it('should return empty path when target topic does not exist', async () => {
      // Arrange
      mockTopicRepository.findById
        .mockResolvedValueOnce(mockTopic)
        .mockResolvedValueOnce(null);

      // Act
      const result = await topicService.findShortestPath('1', 'nonexistent');

      // Assert
      expect(result.path).toEqual([]);
      expect(result.distance).toBe(-1);
    });

    it('should find path between related topics', async () => {
      // Arrange
      const rootTopic: ITopic = { ...mockTopic, id: 'root' };
      const parentTopic: ITopic = { ...mockTopic, id: 'parent', parentTopicId: 'root' };
      const childTopic: ITopic = { ...mockTopic, id: 'child', parentTopicId: 'parent' };
      const siblingTopic: ITopic = { ...mockTopic, id: 'sibling', parentTopicId: 'parent' };

      mockTopicRepository.findById
        .mockImplementation((id: string) => {
          switch (id) {
            case 'child': return Promise.resolve(childTopic);
            case 'sibling': return Promise.resolve(siblingTopic);
            case 'parent': return Promise.resolve(parentTopic);
            case 'root': return Promise.resolve(rootTopic);
            default: return Promise.resolve(null);
          }
        });

      // Act
      const result = await topicService.findShortestPath('child', 'sibling');

      // Assert
      expect(result.sourceTopicId).toBe('child');
      expect(result.targetTopicId).toBe('sibling');
      expect(result.path.length).toBeGreaterThan(0);
      expect(result.distance).toBeGreaterThan(0);
    });
  });

  describe('getTopicVersion', () => {
    it('should return topic version successfully', async () => {
      // Arrange
      const versionedTopic = { ...mockTopic, version: 2 };
      mockTopicRepository.findByVersion.mockResolvedValue(versionedTopic as ITopicVersion);

      // Act
      const result = await topicService.getTopicVersion('1', 2);

      // Assert
      expect(mockTopicRepository.findByVersion).toHaveBeenCalledWith('1', 2);
      expect(result).toEqual(versionedTopic);
    });

    it('should return null when version does not exist', async () => {
      // Arrange
      mockTopicRepository.findByVersion.mockResolvedValue(null);

      // Act
      const result = await topicService.getTopicVersion('1', 999);

      // Assert
      expect(mockTopicRepository.findByVersion).toHaveBeenCalledWith('1', 999);
      expect(result).toBeNull();
    });
  });

  describe('getAllTopics', () => {
    it('should return all topics', async () => {
      // Arrange
      const topics = [mockTopic, mockChildTopic];
      mockTopicRepository.findAll.mockResolvedValue(topics);

      // Act
      const result = await topicService.getAllTopics();

      // Assert
      expect(mockTopicRepository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(topics);
    });

    it('should return empty array when no topics exist', async () => {
      // Arrange
      mockTopicRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await topicService.getAllTopics();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getTopicById', () => {
    it('should return topic when found', async () => {
      // Arrange
      mockTopicRepository.findById.mockResolvedValue(mockTopic);

      // Act
      const result = await topicService.getTopicById('1');

      // Assert
      expect(mockTopicRepository.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockTopic);
    });

    it('should return null when topic not found', async () => {
      // Arrange
      mockTopicRepository.findById.mockResolvedValue(null);

      // Act
      const result = await topicService.getTopicById('nonexistent');

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('deleteTopic', () => {
    it('should delete topic successfully', async () => {
      // Arrange
      mockTopicRepository.delete.mockResolvedValue(true);

      // Act
      const result = await topicService.deleteTopic('1');

      // Assert
      expect(mockTopicRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toBe(true);
    });

    it('should return false when topic not found', async () => {
      // Arrange
      mockTopicRepository.delete.mockResolvedValue(false);

      // Act
      const result = await topicService.deleteTopic('nonexistent');

      // Assert
      expect(result).toBe(false);
    });
  });
});