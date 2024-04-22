export const deduplicateFileChangeEvents = (fileChangeEvents) => {
    const changedFilePaths = [];
    return fileChangeEvents
        .slice()
        .reverse()
        .filter((event) => {
        if (changedFilePaths.includes(event.filename)) {
            return false;
        }
        changedFilePaths.push(event.filename);
        return true;
    })
        .reverse();
};
//# sourceMappingURL=deduplicateFileChangeEvents.js.map