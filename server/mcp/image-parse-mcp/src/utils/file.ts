import * as fs from 'node:fs';
import * as path from 'node:path';

export const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

export const SUPPORTED_IMAGE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/bmp',
];

export function isImageFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return imageExts.includes(ext);
}

export function isVideoFile(filePath: string): boolean {
    const ext = path.extname(filePath).toLowerCase();
    const videoExts = ['.mp4', '.mov', '.m4v', '.avi', '.mkv', '.webm'];
    return videoExts.includes(ext);
}

export function getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp',
        '.bmp': 'image/bmp',
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime',
        '.m4v': 'video/x-m4v',
    };
    return mimeTypes[ext] || 'application/octet-stream';
}

export function readFileAsBase64(filePath: string): string {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }

    const content = fs.readFileSync(filePath);
    return content.toString('base64');
}

export function validateFileSize(filePath: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    if (stats.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`);
    }
}
