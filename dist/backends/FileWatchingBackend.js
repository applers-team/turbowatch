/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/method-signature-style */
import { EventEmitter } from 'node:events';
import path from 'node:path';
export class FileWatchingBackend extends EventEmitter {
    constructor() {
        super();
    }
    emitReady() {
        this.emit('ready');
    }
    emitChange(event) {
        if (!path.isAbsolute(event.filename)) {
            throw new Error('Watchers must emit absolute paths');
        }
        this.emit('change', {
            filename: event.filename,
        });
    }
}
//# sourceMappingURL=FileWatchingBackend.js.map