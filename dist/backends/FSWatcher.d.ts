import { FileWatchingBackend } from './FileWatchingBackend.js';
export declare class FSWatcher extends FileWatchingBackend {
    private fsWatchers;
    private closed;
    constructor(project: string);
    close(): Promise<void>;
}
//# sourceMappingURL=FSWatcher.d.ts.map