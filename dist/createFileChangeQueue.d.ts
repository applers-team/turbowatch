import { type Debounce, type FileChangeEvent, type Subscription } from './types.js';
export declare const createFileChangeQueue: ({ project, abortSignal, userDebounce, subscriptions, }: {
    abortSignal: AbortSignal;
    project: string;
    subscriptions: Subscription[];
    userDebounce: Debounce;
}) => {
    trigger: (fileChangeEvent: FileChangeEvent) => void;
};
//# sourceMappingURL=createFileChangeQueue.d.ts.map