import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { createTransport } from 'nodemailer';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const BLOCKLIST_FILE =
  process.env['BRETTAIO_BLOCKLIST_FILE'] ||
  '/home/brettaio/.local/state/brettaio/blocked-ips.json';

type BlockedIpRecord = {
  firstSeen: string;
  lastSeen: string;
  hits: number;
  reason: string;
  country?: string;
  userAgent?: string;
  paths: Record<string, number>;
};

type BlocklistState = {
  updatedAt: string;
  ips: Record<string, BlockedIpRecord>;
};

const SECURITY_PROBE_PATTERNS = [
  /\/+wp-login\.php(?:\?|$)/i,
  /\/+wp-admin(?:\/|\?|$)/i,
  /\/+wp-includes\//i,
  /\/+wp-content\//i,
  /\/+xmlrpc\.php(?:\?|$)/i,
  /wlwmanifest\.xml(?:\?|$)/i,
  /\/+wordpress(?:\/|\?|$)/i,
  /\/+wp(?:\/|\?|$)/i,
  /\/+site\/wp-/i,
  /\/+blog\/wp-/i,
  /\/+cms\/wp-/i,
  /\/+web\/wp-/i,
  /\/+phpmyadmin(?:\/|\?|$)/i,
  /\/+pma(?:\/|\?|$)/i,
  /\/+adminer(?:\.php)?(?:\?|$)/i,
  /\/+\.env(?:\.|$|\?)/i,
  /\/+\.git(?:\/|\?|$)/i,
  /\/+config(?:\.|\/|\?|$)/i,
  /\/+backup(?:\.|\/|\?|$)/i,
];

let blocklist = loadBlocklist();

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

function isPrivateOrLocalIp(ip: string): boolean {
  const normalized = ip.replace(/^::ffff:/, '');

  return (
    normalized === 'unknown' ||
    normalized === '127.0.0.1' ||
    normalized === '::1' ||
    normalized.startsWith('10.') ||
    normalized.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(normalized) ||
    normalized.startsWith('fe80:') ||
    normalized.startsWith('fd')
  );
}

function loadBlocklist(): BlocklistState {
  try {
    if (!existsSync(BLOCKLIST_FILE)) {
      return {
        updatedAt: new Date().toISOString(),
        ips: {},
      };
    }

    const parsed = JSON.parse(readFileSync(BLOCKLIST_FILE, 'utf8')) as Partial<BlocklistState>;

    return {
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      ips: parsed.ips || {},
    };
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'blocklist_load_failed',
        timestamp: new Date().toISOString(),
        file: BLOCKLIST_FILE,
        error: error instanceof Error ? error.message : String(error),
      }),
    );

    return {
      updatedAt: new Date().toISOString(),
      ips: {},
    };
  }
}

function saveBlocklist(): void {
  const directory = dirname(BLOCKLIST_FILE);
  const tempFile = `${BLOCKLIST_FILE}.tmp`;

  mkdirSync(directory, { recursive: true });

  blocklist.updatedAt = new Date().toISOString();

  writeFileSync(tempFile, JSON.stringify(blocklist, null, 2) + '\n', {
    mode: 0o600,
  });

  renameSync(tempFile, BLOCKLIST_FILE);
}

function isSecurityProbe(path: string): boolean {
  const normalizedPath = path.toLowerCase();

  return SECURITY_PROBE_PATTERNS.some((pattern) =>
    pattern.test(normalizedPath),
  );
}

function isBlockedIp(ip: string): boolean {
  return Boolean(blocklist.ips[ip]);
}

function addIpToBlocklist(req: express.Request, reason: string): void {
  const ip = getClientIp(req);

  if (isPrivateOrLocalIp(ip)) {
    return;
  }

  const now = new Date().toISOString();
  const path = getRequestPath(req);

  const existing = blocklist.ips[ip];

  if (existing) {
    existing.lastSeen = now;
    existing.hits += 1;
    existing.reason = reason;
    existing.country = getHeaderValue(req.headers['cf-ipcountry']) || existing.country;
    existing.userAgent =
      getHeaderValue(req.headers['user-agent']) || existing.userAgent;
    existing.paths[path] = (existing.paths[path] || 0) + 1;
  } else {
    blocklist.ips[ip] = {
      firstSeen: now,
      lastSeen: now,
      hits: 1,
      reason,
      country: getHeaderValue(req.headers['cf-ipcountry']),
      userAgent: getHeaderValue(req.headers['user-agent']),
      paths: {
        [path]: 1,
      },
    };
  }

  saveBlocklist();
}

function logSecurityEvent(
  event: 'security_probe' | 'ip_blocked',
  req: express.Request,
  status: number,
  reason: string,
): void {
  console.warn(
    JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
      method: req.method,
      path: getRequestPath(req),
      status,
      reason,
      host: getHeaderValue(req.headers.host),
      protocol:
        getHeaderValue(req.headers['x-forwarded-proto']) || req.protocol,
      ip: getClientIp(req),
      forwardedFor: getHeaderValue(req.headers['x-forwarded-for']),
      country: getHeaderValue(req.headers['cf-ipcountry']),
      cfRay: getHeaderValue(req.headers['cf-ray']),
      referer: getHeaderValue(req.headers.referer),
      userAgent: getHeaderValue(req.headers['user-agent']),
    }),
  );
}

function shouldLogRequest(path: string): boolean {
  const normalizedPath = path.toLowerCase().split('?')[0] || '/';

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
    normalizedPath.endsWith(extension),
  );
}

app.use((req, res, next) => {
  const ip = getClientIp(req);

  if (!isBlockedIp(ip)) {
    next();
    return;
  }

  const status = 403;
  const reason = 'blocked_ip';

  logSecurityEvent('ip_blocked', req, status, reason);

  res.status(status).type('text/plain').send('Forbidden');
});

app.use((req, res, next) => {
  const path = getRequestPath(req);

  if (!isSecurityProbe(path)) {
    next();
    return;
  }

  const status = 404;
  const reason = 'security_probe_path';

  addIpToBlocklist(req, reason);
  logSecurityEvent('security_probe', req, status, reason);

  res.status(status).type('text/plain').send('Not found');
});

app.use((req, res, next) => {
  const startedAt = process.hrtime.bigint();
  const path = getRequestPath(req);

  res.on('finish', () => {
    if (!shouldLogRequest(path)) {
      return;
    }

    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    console.log(
      JSON.stringify({
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
      }),
    );
  });

  next();
});


app.use(express.json({ limit: '32kb' }));
app.use(express.urlencoded({ extended: false, limit: '32kb' }));

type UnknownRecord = Record<string, unknown>;

type ContactRateLimitRecord = {
  count: number;
  resetAt: number;
};

const contactRateLimits = new Map<string, ContactRateLimitRecord>();
const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const CONTACT_RATE_LIMIT_MAX = 5;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getStringField(
  body: unknown,
  field: string,
  maxLength = 2000,
): string {
  if (!isRecord(body)) {
    return '';
  }

  const value = body[field];

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim().slice(0, maxLength);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isContactRateLimited(ip: string): boolean {
  const now = Date.now();
  const existing = contactRateLimits.get(ip);

  if (!existing || existing.resetAt <= now) {
    contactRateLimits.set(ip, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    });

    return false;
  }

  existing.count += 1;

  return existing.count > CONTACT_RATE_LIMIT_MAX;
}

function getContactSubmissionSummary(body: unknown): string {
  if (!isRecord(body)) {
    return '';
  }

  return Object.entries(body)
    .filter(([key]) => key !== 'bot-field' && key !== 'form-name')
    .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
    .map(([key, value]) => `${key}: ${(value as string).trim()}`)
    .join('\n');
}

async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error(`Timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
}

app.post('/api/contact', async (req, res) => {
  const ip = getClientIp(req);

  if (isContactRateLimited(ip)) {
    res.status(429).json({ ok: false, error: 'rate_limited' });
    return;
  }

  const body = req.body as unknown;
  const honeypot = getStringField(body, 'bot-field', 200);

  if (honeypot) {
    res.status(204).send();
    return;
  }

  const formName =
    getStringField(body, 'formName', 100) ||
    getStringField(body, 'form-name', 100) ||
    'contact';

  const firstName = getStringField(body, 'first-name', 120);
  const lastName = getStringField(body, 'last-name', 120);
  const fallbackName = getStringField(body, 'name', 180);
  const name = fallbackName || `${firstName} ${lastName}`.trim();
  const email = getStringField(body, 'email', 320);

  if (!name || !isValidEmail(email)) {
    res.status(400).json({ ok: false, error: 'invalid_submission' });
    return;
  }

  const smtpHost = process.env['SMTP_HOST'];
  const smtpPort = Number(process.env['SMTP_PORT'] || '587');
  const smtpUser = process.env['SMTP_USER'];
  const smtpPass = process.env['SMTP_PASS'];
  const contactToEmail = process.env['CONTACT_TO_EMAIL'] || smtpUser;
  const contactFromEmail = process.env['CONTACT_FROM_EMAIL'] || smtpUser;

  if (!smtpHost || !smtpUser || !smtpPass || !contactToEmail || !contactFromEmail) {
    console.error(
      JSON.stringify({
        event: 'contact_email_not_configured',
        timestamp: new Date().toISOString(),
        formName,
      }),
    );

    res.status(503).json({ ok: false, error: 'email_not_configured' });
    return;
  }

  const transporter = createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort !== 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 20000,
  });

  const summary = getContactSubmissionSummary(body);

  try {
    await withTimeout(
      transporter.sendMail({
        to: contactToEmail,
        from: contactFromEmail,
        replyTo: email,
        subject: `bretta.io contact form — ${formName}`,
        text: [
          `New bretta.io contact form submission`,
          '',
          `Form: ${formName}`,
          `Name: ${name}`,
          `Email: ${email}`,
          '',
          summary,
        ].join('\n'),
      }),
      25000,
    );

    console.log(
      JSON.stringify({
        event: 'contact_submission_sent',
        timestamp: new Date().toISOString(),
        formName,
        ip,
      }),
    );

    res.status(200).json({ ok: true });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'contact_submission_failed',
        timestamp: new Date().toISOString(),
        formName,
        ip,
        error: error instanceof Error ? error.message : String(error),
      }),
    );

    res.status(502).json({ ok: false, error: 'email_send_failed' });
  }
});


app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
