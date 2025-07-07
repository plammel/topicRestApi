import { ITopic, ITopicVersion } from '../types';
import { Topic } from './Topic';

export class TopicVersion extends Topic implements ITopicVersion {
  public originalTopicId: string;
  public isLatest: boolean;

  constructor(originalTopic: ITopic, isLatest: boolean = false) {
    super(originalTopic);
    this.originalTopicId = originalTopic.id!;
    this.isLatest = isLatest;
  }

  public markAsLatest(): void {
    this.isLatest = true;
  }

  public markAsOld(): void {
    this.isLatest = false;
  }
}
