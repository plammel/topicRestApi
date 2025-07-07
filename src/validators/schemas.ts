import { z } from 'zod';
import { UserRole, ResourceType } from '../types';

export const createTopicSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    content: z.string().min(1, 'Content is required'),
    parentTopicId: z.string().uuid().optional()
  })
});

export const updateTopicSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    content: z.string().min(1).optional(),
    parentTopicId: z.string().uuid().optional()
  }),
  params: z.object({
    id: z.string().uuid()
  })
});

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
    email: z.string().email('Invalid email format'),
    role: z.nativeEnum(UserRole)
  })
});

export const createResourceSchema = z.object({
  body: z.object({
    topicId: z.string().uuid('Invalid topic ID'),
    url: z.string().url('Invalid URL format'),
    description: z.string().min(1, 'Description is required'),
    type: z.nativeEnum(ResourceType)
  })
});

export const pathFindingSchema = z.object({
  params: z.object({
    sourceId: z.string().uuid('Invalid source ID'),
    targetId: z.string().uuid('Invalid target ID')
  }),
  query: z.object({
    maxDepth: z.string().transform(val => parseInt(val, 10)).optional()
  })
});