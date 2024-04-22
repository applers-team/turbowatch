import { TurboWatcher } from './backends/TurboWatcher.js';
import { type TurbowatchConfigurationInput } from './types.js';

export const defineConfig = (
  configurationInput: TurbowatchConfigurationInput,
): TurbowatchConfigurationInput => {
  return {
    Watcher: TurboWatcher,
    ...configurationInput,
  };
};
