import { TurboWatcher } from './backends/TurboWatcher.js';
export const defineConfig = (configurationInput) => {
    return {
        Watcher: TurboWatcher,
        ...configurationInput,
    };
};
//# sourceMappingURL=defineConfig.js.map