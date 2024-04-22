/* eslint-disable canonical/filename-match-regex */
import { FileWatchingBackend } from './FileWatchingBackend.js';
import { glob } from 'glob';
import { watch } from 'node:fs';
import { lstat, realpath } from 'node:fs/promises';
import path from 'node:path';
const findSymlinks = async (project) => {
    const filenames = await glob('./**/*/', {
        absolute: true,
        cwd: project,
        dot: true,
        follow: false,
    });
    const symlinks = [];
    for (const filename of filenames) {
        let stats;
        try {
            stats = await lstat(filename);
        }
        catch {
            continue;
        }
        if (stats.isSymbolicLink()) {
            let fileRealpath;
            try {
                fileRealpath = await realpath(filename);
            }
            catch {
                continue;
            }
            if (!symlinks.some((symlink) => symlink.symlink === fileRealpath)) {
                symlinks.push({
                    realpath: fileRealpath,
                    symlink: filename,
                });
            }
        }
    }
    return symlinks;
};
export class FSWatcher extends FileWatchingBackend {
    constructor(project) {
        super();
        this.fsWatchers = [];
        this.closed = false;
        // eslint-disable-next-line unicorn/consistent-function-scoping
        const watchPath = (target) => {
            return watch(target, {
                encoding: 'utf8',
                persistent: true,
                recursive: true,
            }, (eventType, filename) => {
                this.emitChange({ filename: path.resolve(target, filename) });
            });
        };
        this.fsWatchers.push(watchPath(project));
        // TODO detect when a new symlink is added to the project
        // eslint-disable-next-line promise/prefer-await-to-then
        findSymlinks(project).then((symlinks) => {
            if (this.closed) {
                return;
            }
            for (const symlink of symlinks) {
                this.fsWatchers.push(watch(symlink.realpath, {
                    encoding: 'utf8',
                    persistent: true,
                    recursive: true,
                }, (eventType, filename) => {
                    const absolutePath = path.resolve(symlink.realpath, filename);
                    this.emitChange({
                        filename: path.join(symlink.symlink, path.relative(symlink.realpath, absolutePath)),
                    });
                }));
            }
            this.emitReady();
        });
    }
    async close() {
        this.closed = true;
        for (const fsWatcher of this.fsWatchers) {
            fsWatcher.close();
        }
    }
}
//# sourceMappingURL=FSWatcher.js.map