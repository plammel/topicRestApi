import { ITopic } from '../types';
import { Topic } from '../models/Topic';
import { TopicVersion } from '../models/TopicVersion';

export abstract class TopicFactory {
  public abstract createTopic(data: ITopic): Topic;
  public abstract createTopicVersion(originalTopic: ITopic): TopicVersion;
}

export class StandardTopicFactory extends TopicFactory {
  public createTopic(data: ITopic): Topic {
    return new Topic(data);
  }

  public createTopicVersion(originalTopic: ITopic): TopicVersion {
    return new TopicVersion(originalTopic, false);
  }
}