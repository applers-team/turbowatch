import { deduplicateFileChangeEvents } from './deduplicateFileChangeEvents.js';
import { hashFile } from './hashFile.js';
import { testExpression } from './testExpression.js';
import path from 'node:path';
import { debounce } from 'throttle-debounce';
export const createFileChangeQueue = ({ project, abortSignal, userDebounce, subscriptions, }) => {
    const fileHashMap = {};
    let queuedFileChangeEvents = [];
    const evaluateSubscribers = debounce(userDebounce.wait, () => {
        const currentFileChangeEvents = deduplicateFileChangeEvents(queuedFileChangeEvents);
        queuedFileChangeEvents = [];
        const filesWithUnchangedHash = [];
        for (const fileChangeEvent of currentFileChangeEvents) {
            const { filename, hash } = fileChangeEvent;
            if (!hash) {
                continue;
            }
            const previousHash = fileHashMap[filename];
            if (previousHash === hash) {
                filesWithUnchangedHash.push(filename);
            }
            else {
                fileHashMap[filename] = hash;
            }
        }
        for (const subscription of subscriptions) {
            const relevantEvents = [];
            for (const fileChangeEvent of currentFileChangeEvents) {
                if (filesWithUnchangedHash.includes(fileChangeEvent.filename)) {
                    continue;
                }
                if (!testExpression(subscription.expression, path.relative(project, fileChangeEvent.filename))) {
                    continue;
                }
                relevantEvents.push(fileChangeEvent);
            }
            if (relevantEvents.length) {
                if (abortSignal?.aborted) {
                    return;
                }
                void subscription.trigger(relevantEvents);
            }
        }
    }, {
        noLeading: true,
    });
    return {
        trigger: (fileChangeEvent) => {
            if (fileChangeEvent.hash === undefined) {
                // eslint-disable-next-line promise/prefer-await-to-then
                hashFile(fileChangeEvent.filename).then((hash) => {
                    queuedFileChangeEvents.push({
                        ...fileChangeEvent,
                        hash,
                    });
                    evaluateSubscribers();
                });
            }
            else {
                queuedFileChangeEvents.push(fileChangeEvent);
                evaluateSubscribers();
            }
        },
    };
};
//# sourceMappingURL=createFileChangeQueue.js.map