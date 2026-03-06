const fs = require('fs');
const path = require('path');

/**
 * Moves files from temporary to permanent storage.
 * @param {string[]} filePaths - Array of file paths (e.g., ['uploads/temp/file1.jpg'])
 * @param {string} targetDir - Destination directory (e.g., 'uploads/jobcard/images')
 * @returns {Promise<string[]>} - Array of new file paths.
 */
const moveFiles = async (filePaths, targetDir) => {
    if (!filePaths || !Array.isArray(filePaths) || filePaths.length === 0) {
        return [];
    }

    // Ensure target directory exists
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const movedPaths = await Promise.all(
        filePaths.map(async (filePath) => {
            // Only move if the file is in the temp directory
            if (filePath.includes('uploads/temp')) {
                const fileName = path.basename(filePath);
                const newPath = path.join(targetDir, fileName).replace(/\\/g, '/');

                try {
                    // Using rename instead of copy + unlink for efficiency on same filesystem
                    fs.renameSync(filePath, newPath);
                    return newPath;
                } catch (err) {
                    console.error(`Error moving file ${filePath} to ${newPath}:`, err);
                    return filePath; // Fallback to old path if move fails
                }
            }
            return filePath; // Already moved or not a temp file
        })
    );

    return movedPaths;
};

module.exports = { moveFiles };
