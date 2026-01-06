import type { OssConfig } from '../config.js';
import { Logger } from './logger.js';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

export let ossConfig: OssConfig | undefined;

export function setOssConfig(config: OssConfig | undefined): void {
    ossConfig = config;
}

export function isOssConfigured(): boolean {
    return !!(ossConfig?.accessKeyId && ossConfig?.accessKeySecret && ossConfig?.bucket);
}

/**
 * Upload a local file to Alibaba Cloud OSS
 * @param filePath - Local file path
 * @returns OSS URL of the uploaded file
 */
export async function uploadToOss(filePath: string): Promise<string> {
    if (!isOssConfigured()) {
        throw new Error('OSS is not configured. Please set OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, and OSS_BUCKET environment variables.');
    }

    // Validate file exists
    if (!existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const fileName = `mcp-upload/${timestamp}-${random}${ext}`;

    try {
        // Dynamic import to avoid requiring ali-oss if not configured
        const OSS = (await import('ali-oss')).default;

        const client = new OSS({
            region: ossConfig!.region,
            accessKeyId: ossConfig!.accessKeyId,
            accessKeySecret: ossConfig!.accessKeySecret,
            bucket: ossConfig!.bucket,
        });

        const fileBuffer = readFileSync(filePath);

        // Upload to OSS
        const result = await client.put(fileName, fileBuffer);

        Logger.info(`Uploaded file to OSS: ${result.url}`);

        return result.url;
    } catch (error) {
        Logger.error('Failed to upload to OSS:', error);
        throw error;
    }
}

/**
 * Get file extension from file path
 */
export function getFileExtension(filePath: string): string {
    return path.extname(filePath).toLowerCase();
}

/**
 * Check if file extension is valid for image upload
 */
export function isValidImageExtension(filePath: string): boolean {
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    return validExtensions.includes(getFileExtension(filePath));
}

/**
 * Check if file extension is valid for video upload
 */
export function isValidVideoExtension(filePath: string): boolean {
    const validExtensions = ['.mp4', '.mov', '.m4v', '.avi', '.mkv', '.webm'];
    return validExtensions.includes(getFileExtension(filePath));
}

/**
 * Check if input is a local file path
 * Supports: absolute path (/path/to/file), relative path (./path, ../path), file:// URI
 * Excludes: http://, https://, oss:// URLs
 */
export function isLocalFilePath(input: string): boolean {
    // Empty or whitespace only
    if (!input || !input.trim()) {
        return false;
    }

    const trimmed = input.trim();

    // Exclude URLs
    if (isValidUrl(trimmed)) {
        return false;
    }

    // Check for file:// protocol
    if (trimmed.toLowerCase().startsWith('file://')) {
        return true;
    }

    // Check for local path patterns
    // Absolute Unix path
    if (trimmed.startsWith('/')) {
        return true;
    }

    // Relative paths
    if (trimmed.startsWith('./') || trimmed.startsWith('../')) {
        return true;
    }

    // Windows absolute path (e.g., C:\, D:\)
    if (/^[a-zA-Z]:[/\\]/.test(trimmed)) {
        return true;
    }

    return false;
}

/**
 * Check if input is a valid URL (http/https/oss/etc.)
 */
export function isValidUrl(input: string): boolean {
    try {
        const url = new URL(input);
        return ['http:', 'https:', 'oss:'].includes(url.protocol);
    } catch {
        return false;
    }
}

/**
 * Normalize video input - upload local files to OSS, keep URLs as-is
 */
export async function normalizeVideoInput(input: string): Promise<string> {
    if (isLocalFilePath(input)) {
        // If OSS is configured, upload to OSS first
        if (isOssConfigured()) {
            try {
                const ossUrl = await uploadToOss(input);
                return ossUrl;
            } catch (error) {
                console.warn(`Failed to upload video to OSS: ${error}`);
                throw error;
            }
        } else {
            throw new Error('OSS is not configured. Please set OSS_ACCESS_KEY_ID, OSS_ACCESS_KEY_SECRET, and OSS_BUCKET environment variables for local video upload.');
        }
    }
    // Already a URL, return as-is
    return input;
}
