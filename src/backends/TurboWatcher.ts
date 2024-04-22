/* eslint-disable canonical/filename-match-regex */

import { isFSWatcherAvailable } from '../isFSWatcherAvailable.js';
import { Logger } from '../Logger.js';
import { ChokidarWatcher } from './ChokidarWatcher.js';
import { FileWatchingBackend } from './FileWatchingBackend.js';
import { FSWatcher } from './FSWatcher.js';

const log = Logger.child({
  namespace: 'TurboWatcher',
});

export class TurboWatcher extends FileWatchingBackend {
  private backend: FileWatchingBackend;

  public constructor(project: string) {
    super();

    if (isFSWatcherAvailable()) {
      log.info('using native FSWatcher');
      this.backend = new FSWatcher(project);
    } else {
      log.info('using native ChokidarWatcher');
      this.backend = new ChokidarWatcher(project);
    }

    this.backend.on('ready', () => {
      this.emit('ready');
    });

    this.backend.on('change', (event) => {
      this.emit('change', event);
    });
  }

  public close() {
    return this.backend.close();
  }
}
