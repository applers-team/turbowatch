import { FileWatchingBackend } from './FileWatchingBackend.js';
export declare class ChokidarWatcher extends FileWatchingBackend {
    private chokidar;
    private indexingIntervalId;
    constructor(project: string);
    close(): Promise<void>;
}
//# sourceMappingURL=ChokidarWatcher.d.ts.map