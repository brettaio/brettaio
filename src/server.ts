import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.set('trust proxy', true);

function getHeaderValue(
  value: string | string[] | undefined,
): string | undefined {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value;
}

function getClientIp(req: express.Request): string {
  const cloudflareIp = getHeaderValue(req.headers['cf-connecting-ip']);
  const trueClientIp = getHeaderValue(req.headers['true-client-ip']);
  const forwardedFor = getHeaderValue(req.headers['x-forwarded-for']);

  if (cloudflareIp) {
    return cloudflareIp;
  }

  if (trueClientIp) {
    return trueClientIp;
  }

  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || req.ip || 'unknown';
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
}

function getRequestPath(req: express.Request): string {
  return req.originalUrl || req.url || '/';
}

function shouldLogRequest(path: string): boolean {
  const ignoredExtensions = [
    '.css',
    '.js',
    '.mjs',
    '.map',
    '.ico',
    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.svg',
    '.woff',
    '.woff2',
    '.ttf',
  ];

  return !ignoredExtensions.some((extension) =>
    path.toLowerCase().split('?')[0]?.endsWith(extension),
  );
}

app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();
  const path = getRequestPath(req);

  res.on('finish', () => {
    if (!shouldLogRequest(path)) {
      return;
    }

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    const accessLog = {
      event: 'access',
      timestamp: new Date().toISOString(),
      method: req.method,
      path,
      status: res.statusCode,
      durationMs: Math.round(durationMs),
      host: getHeaderValue(req.headers.host),
      protocol:
        getHeaderValue(req.headers['x-forwarded-proto']) || req.protocol,
      ip: getClientIp(req),
      forwardedFor: getHeaderValue(req.headers['x-forwarded-for']),
      country: getHeaderValue(req.headers['cf-ipcountry']),
      cfRay: getHeaderValue(req.headers['cf-ray']),
      referer: getHeaderValue(req.headers.referer),
      userAgent: getHeaderValue(req.headers['user-agent']),
      contentLength: res.getHeader('content-length')?.toString(),
    };

    console.log(JSON.stringify(accessLog));
  });

  next();
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI during build/dev-server.
 */
export const reqHandler = createNodeRequestHandler(app);
