import { randomUUID } from 'node:crypto';
export const generateShortId = () => {
    return randomUUID().split('-')[0];
};
//# sourceMappingURL=generateShortId.js.map