
export interface ILimit {
    type: 'size' | 'ratio' | 'maxSize', // size为固定宽高，ratio为各比例
    width?: number,
    height?: number,
    minDuration?: number,
    maxDuration?: number,
    message?: string
}