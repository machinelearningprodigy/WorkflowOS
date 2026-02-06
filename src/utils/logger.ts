type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
    private prefix: string;

    constructor(prefix: string = 'WorkflowOS') {
        this.prefix = prefix;
    }

    private log(level: LogLevel, message: string, ...args: any[]) {
        const timestamp = new Date().toISOString();
        const color = {
            info: '\x1b[32m',
            warn: '\x1b[33m',
            error: '\x1b[31m',
            debug: '\x1b[34m',
        }[level];
        const reset = '\x1b[0m';

        console.log(
            `${reset}[${timestamp}] ${color}${level.toUpperCase()}${reset} [${this.prefix}]: ${message}`,
            ...args
        );
    }

    info(message: string, ...args: any[]) { this.log('info', message, ...args); }
    warn(message: string, ...args: any[]) { this.log('warn', message, ...args); }
    error(message: string, ...args: any[]) { this.log('error', message, ...args); }
    debug(message: string, ...args: any[]) { this.log('debug', message, ...args); }
}

export const logger = new Logger();
