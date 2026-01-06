import { readFileAsBase64, getMimeType } from './file.js';
import { uploadToOss, isOssConfigured } from './oss.js';

export type ImageInputType = 'local' | 'url' | 'base64';

export interface NormalizedImage {
    type: ImageInputType;
    data: string;
    mimeType?: string;
}

export function isValidBase64(str: string): boolean {
    if (str.length < 100) return false;
    const base64Regex = /^[A-Za-z0-9+/=]+$/;
    return base64Regex.test(str);
}

export function detectImageInputType(input: string): ImageInputType {
    // Check if it's a URL
    if (input.startsWith('http://') || input.startsWith('https://')) {
        return 'url';
    }

    // Check if it's a local file path
    if (input.startsWith('/') || input.startsWith('./') || input.startsWith('../')) {
        return 'local';
    }

    // Check if it's a Base64 string
    if (isValidBase64(input)) {
        return 'base64';
    }

    // Default to local (might be a relative path without ./)
    return 'local';
}

export async function normalizeImageInput(input: string): Promise<NormalizedImage> {
    const type = detectImageInputType(input);

    switch (type) {
        case 'local': {
            // If OSS is configured, upload to OSS first
            if (isOssConfigured()) {
                try {
                    const ossUrl = await uploadToOss(input);
                    return {
                        type: 'url',
                        data: ossUrl,
                        mimeType: getMimeType(input),
                    };
                } catch (error) {
                    console.warn(`Failed to upload to OSS, falling back to base64: ${error}`);
                    // Fall back to base64 if OSS upload fails
                }
            }
            // Default: read as base64
            const mimeType = getMimeType(input);
            const base64 = readFileAsBase64(input);
            return {
                type: 'base64',
                data: `data:${mimeType};base64,${base64}`,
                mimeType,
            };
        }

        case 'url':
            return {
                type: 'url',
                data: input,
            };

        case 'base64':
            return {
                type: 'base64',
                data: `data:image/png;base64,${input}`,
            };

        default:
            throw new Error(`Unknown image input type: ${type}`);
    }
}

export function isImageUrl(url: string): boolean {
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i;
    const imageMimeTypes = /^image\//;
    return imageExtensions.test(url) || imageMimeTypes.test(url);
}

export function isVideoUrl(url: string): boolean {
    const videoExtensions = /\.(mp4|mov|m4v|avi|mkv|webm)(\?.*)?$/i;
    const videoMimeTypes = /^video\//;
    return videoExtensions.test(url) || videoMimeTypes.test(url);
}
