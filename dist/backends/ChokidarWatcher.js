import { Logger } from '../Logger.js';
import { FileWatchingBackend } from './FileWatchingBackend.js';
import * as chokidar from 'chokidar';
const log = Logger.child({
    namespace: 'ChokidarWatcher',
});
export class ChokidarWatcher extends FileWatchingBackend {
    constructor(project) {
        super();
        let discoveredFileCount = 0;
        this.indexingIntervalId = setInterval(() => {
            log.trace('indexed %s %s...', discoveredFileCount.toLocaleString('en-US'), discoveredFileCount === 1 ? 'file' : 'files');
        }, 5000);
        this.chokidar = chokidar.watch(project, {
            awaitWriteFinish: false,
            followSymlinks: true,
        });
        let ready = false;
        this.chokidar.on('ready', () => {
            clearInterval(this.indexingIntervalId);
            ready = true;
            this.emitReady();
        });
        this.chokidar.on('all', (event, filename) => {
            if (!ready) {
                discoveredFileCount++;
                return;
            }
            if (event === 'addDir') {
                return;
            }
            this.emitChange({ filename });
        });
    }
    close() {
        clearInterval(this.indexingIntervalId);
        return this.chokidar.close();
    }
}
//# sourceMappingURL=ChokidarWatcher.js.map