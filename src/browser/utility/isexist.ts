import * as fs from 'fs';

export function isExistFile(file: string): boolean {
    try {
        fs.statSync(file);
        return true;
    } catch (err) {
        if (err.code === 'ENOENT') return false;
    }
    return false;
}
