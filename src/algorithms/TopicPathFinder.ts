import path from 'path';
import { ITopic, ITopicPath } from '../types';
import { TopicService } from 'services/TopicService';


export class TopicPathFinder {
    private topics: ITopic[];
    private adjacencyMap: Map<string, string[]> = new Map();
    private topicService: TopicService

    constructor(topics: ITopic[], topicService: TopicService) {
        // this.topics = topics;
        // this.buildAdjacencyMap(); 
        this.topicService = topicService
    }

    //   private buildAdjacencyMap(): void {
    //     // Initialize adjacency map
    //     this.topics.forEach(topic => {
    //       this.adjacencyMap.set(topic.id, []);
    //     });

    //     // Build bidirectional connections (parent-child relationships)
    //     this.topics.forEach(topic => {
    //       if (topic.parentTopicId) {
    //         // Add edge from parent to child
    //         const parentConnections = this.adjacencyMap.get(topic.parentTopicId) || [];
    //         parentConnections.push(topic.id);
    //         this.adjacencyMap.set(topic.parentTopicId, parentConnections);

    //         // Add edge from child to parent
    //         const childConnections = this.adjacencyMap.get(topic.id) || [];
    //         childConnections.push(topic.parentTopicId);
    //         this.adjacencyMap.set(topic.id, childConnections);
    //       }
    //     });
    //   }

    public async findShortestPath(sourceId: string, targetId: string) {
        const topicPath: ITopicPath = {
            sourceTopicId: sourceId,
            targetTopicId: targetId,
            path: [],
            distance: -1
        }

        if (sourceId === targetId) {
            topicPath.path.push(sourceId)
            topicPath.distance = 0
            return topicPath;
        }

        const sourceTopic = await this.topicService.getTopicById(sourceId)
        const targetTopic = await this.topicService.getTopicById(targetId)

        if (!sourceTopic || !targetTopic) {
            return topicPath;
        }

        let sourcePath = await this.getNodePathToRoot(sourceTopic);
        let targetPath = await this.getNodePathToRoot(targetTopic);

        if (sourcePath[sourcePath.length - 1] !== targetPath[targetPath.length - 1]) {
            return topicPath;
        }

        sourcePath.pop();
        targetPath.pop();

        while (sourcePath[sourcePath.length - 1] && targetPath[targetPath.length - 1]) {
            if (sourcePath[sourcePath.length - 1] !== targetPath[targetPath.length - 1]) {
                topicPath.distance = sourcePath.length + targetPath.length;
                topicPath.path = topicPath.path.concat(...sourcePath, ...(targetPath.reverse()))
            }
            sourcePath.pop();
            targetPath.pop();
        }

        return topicPath;
    }

    private async getNodePathToRoot(node: ITopic): Promise<string[]> {
        let nextParentId = node.parentTopicId;
        let currentNode: ITopic | null = node;
        let path: string[] = []
        while (nextParentId) {
            currentNode = await this.topicService.getTopicById(nextParentId)
            nextParentId = currentNode?.parentTopicId
            if (currentNode) {
                path.push(currentNode.id!)
            }
        }

        return path;
    }

    //   public findAllPaths(sourceId: string, targetId: string, maxDepth: number = 10): IPathNode[] {
    //     const allPaths: IPathNode[] = [];
    //     const visited = new Set<string>();

    //     this.dfsPathSearch(sourceId, targetId, [sourceId], visited, allPaths, 0, maxDepth);

    //     return allPaths.sort((a, b) => a.distance - b.distance);
    //   }

    //   private dfsPathSearch(
    //     currentId: string,
    //     targetId: string,
    //     currentPath: string[],
    //     visited: Set<string>,
    //     allPaths: IPathNode[],
    //     depth: number,
    //     maxDepth: number
    //   ): void {
    //     if (depth > maxDepth) return;

    //     if (currentId === targetId) {
    //       const targetTopic = this.topics.find(t => t.id === targetId);
    //       if (targetTopic) {
    //         allPaths.push({
    //           topicId: targetId,
    //           name: targetTopic.name,
    //           distance: depth,
    //           path: [...currentPath]
    //         });
    //       }
    //       return;
    //     }

    //     visited.add(currentId);
    //     const neighbors = this.adjacencyMap.get(currentId) || [];

    //     for (const neighborId of neighbors) {
    //       if (!visited.has(neighborId)) {
    //         this.dfsPathSearch(
    //           neighborId,
    //           targetId,
    //           [...currentPath, neighborId],
    //           new Set(visited),
    //           allPaths,
    //           depth + 1,
    //           maxDepth
    //         );
    //       }
    //     }
    //   }
}