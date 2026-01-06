export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
    level: LogLevel;
}

export const Logger = {
    _level: 'info' as LogLevel,

    setLevel(level: LogLevel): void {
        this._level = level;
    },

    _shouldLog(level: LogLevel): boolean {
        const levels: Record<LogLevel, number> = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };
        return levels[level] >= levels[this._level];
    },

    debug(...args: unknown[]): void {
        if (this._shouldLog('debug')) {
            console.debug('[DEBUG]', ...args);
        }
    },

    info(...args: unknown[]): void {
        if (this._shouldLog('info')) {
            console.info('[INFO]', ...args);
        }
    },

    warn(...args: unknown[]): void {
        if (this._shouldLog('warn')) {
            console.warn('[WARN]', ...args);
        }
    },

    error(...args: unknown[]): void {
        if (this._shouldLog('error')) {
            console.error('[ERROR]', ...args);
        }
    },
};

export function initLogger(options: LoggerOptions): void {
    Logger.setLevel(options.level);
}
