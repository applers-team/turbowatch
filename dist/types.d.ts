import { type FileWatchingBackend } from './backends/FileWatchingBackend.js';
import { type Logger } from 'roarr';
import { type ProcessOutput } from 'zx';
export type Expression = ['allof', ...Expression[]] | ['anyof', ...Expression[]] | ['dirname' | 'idirname', string] | ['match' | 'imatch', string] | ['match' | 'imatch', string, 'basename' | 'wholename'] | ['not', Expression];
type JsonValue = JsonObject | JsonValue[] | boolean | number | string | readonly JsonValue[] | null | undefined;
export type JsonObject = {
    [k: string]: JsonValue;
};
type File = {
    name: string;
};
/**
 * @property attempt Attempt number (starting with 0) indicating if trigger was retried.
 * @property files Describes the list of files that changed.
 * @property first Identifies if this is the first event.
 * @property signal Instance of AbortSignal used to signal when the routine should be aborted.
 * @property spawn Instance of zx bound to AbortSignal.
 */
export type ChangeEvent = {
    abortSignal?: AbortSignal;
    attempt: number;
    files: readonly File[];
    first: boolean;
    log: Logger;
    spawn: (pieces: TemplateStringsArray, ...args: any[]) => Promise<ProcessOutput>;
    taskId: string;
};
type OnChangeEventHandler = (event: ChangeEvent) => Promise<any>;
export type TeardownEvent = {
    spawn: (pieces: TemplateStringsArray, ...args: any[]) => Promise<ProcessOutput>;
};
type OnTeardownEventHandler = (event: TeardownEvent) => Promise<void>;
/**
 * @property factor The exponential factor to use. Default is 2.
 * @property maxTimeout The maximum number of milliseconds between two retries. Default is 30,000.
 * @property minTimeout The number of milliseconds before starting the first retry. Default is 1000.
 * @property retries The maximum amount of times to retry the operation. Default is 10. Seting this to 1 means do it once, then retry it once.
 */
type Retry = {
    factor?: number;
    maxTimeout?: number;
    minTimeout?: number;
    retries: number;
};
export type Debounce = {
    wait: number;
};
export type Throttle = {
    delay: number;
};
/**
 * @property expression watchman expression, e.g. https://facebook.github.io/watchman/docs/expr/allof.html
 * @property interruptible Sends abort signal to an ongoing routine, if any. Otherwise, waits for routine to finish. (default: true)
 * @property initialRun Indicates whether onChange is run when the script is first initiated.
 * @property name Name of the trigger. Used for debugging. Must match /^[a-z0-9-_]+$/ pattern and must be unique.
 * @property onChange Routine that is executed when file changes are detected.
 * @property persistent Label a task as persistent if it is a long-running process, such as a dev server or --watch mode.
 */
export type TriggerInput = {
    expression: Expression;
    initialRun?: boolean;
    interruptible?: boolean;
    name: string;
    onChange: OnChangeEventHandler;
    onTeardown?: OnTeardownEventHandler;
    persistent?: boolean;
    retry?: Retry;
    throttleOutput?: Throttle;
};
export type Trigger = {
    abortSignal: AbortSignal;
    cwd?: string;
    expression: Expression;
    id: string;
    initialRun: boolean;
    interruptible: boolean;
    name: string;
    onChange: OnChangeEventHandler;
    onTeardown?: OnTeardownEventHandler;
    persistent: boolean;
    retry: Retry;
    throttleOutput: Throttle;
};
export type WatcherConstructable = new (project: string) => FileWatchingBackend;
/**
 * @property project absolute path to the directory to watch
 */
export type TurbowatchConfigurationInput = {
    readonly Watcher?: WatcherConstructable;
    readonly abortController?: AbortController;
    readonly cwd?: string;
    readonly debounce?: Debounce;
    readonly project: string;
    readonly triggers: readonly TriggerInput[];
};
export type TurbowatchConfiguration = {
    readonly Watcher: WatcherConstructable;
    readonly abortController: AbortController;
    readonly cwd?: string;
    readonly debounce: Debounce;
    readonly project: string;
    readonly triggers: readonly TriggerInput[];
};
export type FileChangeEvent = {
    filename: string;
    hash?: string | null;
};
/**
 * @property queued Indicates that a follow action has been queued.
 */
export type ActiveTask = {
    abortController: AbortController | null;
    id: string;
    promise: Promise<unknown>;
    queued: boolean;
};
export type Subscription = {
    activeTask: ActiveTask | null;
    expression: Expression;
    initialRun: boolean;
    persistent: boolean;
    teardown: () => Promise<void>;
    trigger: (events: readonly FileChangeEvent[]) => Promise<void>;
};
export type TurbowatchController = {
    shutdown: () => Promise<void>;
};
export {};
//# sourceMappingURL=types.d.ts.map