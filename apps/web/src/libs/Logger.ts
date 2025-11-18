type LoggerLike = {
  debug: (...args: any[]) => void;
  info: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

const createClientLogger = (): LoggerLike => ({
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
});

const isServer = typeof window === 'undefined';

let loggerInstance: LoggerLike;
let dbLoggerInstance: LoggerLike;
let authLoggerInstance: LoggerLike;
let securityLoggerInstance: LoggerLike;

if (isServer) {
  const logTape = await import('@logtape/logtape');
  const { Env } = await import('./Env');
  type ConfigureParams = Parameters<typeof logTape.configure>[0];

  const betterStackToken
    = Env.BETTER_STACK_SOURCE_TOKEN ?? Env.NEXT_PUBLIC_BETTER_STACK_SOURCE_TOKEN;
  const betterStackHost
    = Env.BETTER_STACK_INGESTING_HOST
      ?? Env.NEXT_PUBLIC_BETTER_STACK_INGESTING_HOST;

  const sinks: ConfigureParams['sinks'] = {
    console: logTape.getConsoleSink({ formatter: logTape.getJsonLinesFormatter() }),
  };

  if (betterStackToken && betterStackHost) {
    sinks.betterStack = logTape.fromAsyncSink(async (record) => {
      await fetch(`https://${betterStackHost}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${betterStackToken}`,
        },
        body: JSON.stringify(record),
      });
    });
  }

  await logTape.configure({
    sinks,
    loggers: [
      {
        category: ['logtape', 'meta'],
        sinks: ['console'],
        lowestLevel: 'warning',
      },
      {
        category: ['app'],
        sinks: betterStackToken && betterStackHost ? ['console', 'betterStack'] : ['console'],
        lowestLevel: 'debug',
      },
      {
        category: ['app', 'db'],
        sinks: betterStackToken && betterStackHost ? ['console', 'betterStack'] : ['console'],
        lowestLevel: 'debug',
      },
      {
        category: ['app', 'auth'],
        sinks: betterStackToken && betterStackHost ? ['console', 'betterStack'] : ['console'],
        lowestLevel: 'debug',
      },
      {
        category: ['app', 'security'],
        sinks: betterStackToken && betterStackHost ? ['console', 'betterStack'] : ['console'],
        lowestLevel: 'debug',
      },
    ],
  });

  loggerInstance = logTape.getLogger(['app']);
  dbLoggerInstance = logTape.getLogger(['app', 'db']);
  authLoggerInstance = logTape.getLogger(['app', 'auth']);
  securityLoggerInstance = logTape.getLogger(['app', 'security']);
} else {
  loggerInstance = createClientLogger();
  dbLoggerInstance = createClientLogger();
  authLoggerInstance = createClientLogger();
  securityLoggerInstance = createClientLogger();
}

export const logger = loggerInstance;
export const dbLogger = dbLoggerInstance;
export const authLogger = authLoggerInstance;
export const securityLogger = securityLoggerInstance;
