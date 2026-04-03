// src/services/proxyService.js
import axios from 'axios';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const isRetryable = (err) => {
  if (!err.response) return true; // timeout/network
  return err.response.status >= 500;
};

export async function forwardWithRetry({ req, targetBaseUrl, timeoutMs, retryCount, matchedPrefix }) {
  // Build upstream path by removing matched prefix from req.path
  // req.path is already normalized by Express mount point
  let targetPath = req.path;
  
  if (matchedPrefix && req.path.startsWith(matchedPrefix)) {
    targetPath = req.path.slice(matchedPrefix.length);
  }

  // Ensure targetPath starts with /
  if (!targetPath.startsWith('/')) {
    targetPath = '/' + targetPath;
  }

  const targetUrl = `${targetBaseUrl}${targetPath}`;

  const headers = {
    authorization: req.headers.authorization,
    'content-type': req.headers['content-type'],
    'x-request-id': req.headers['x-request-id'] || `gw-${Date.now()}`,
    'x-forwarded-for': req.ip,
    'x-forwarded-host': req.get('host'),
    'x-forwarded-proto': req.protocol,
    'user-agent': req.headers['user-agent'],
  };

  console.log(`[Proxy] Forwarding ${req.method} ${req.path} (matchedPrefix: ${matchedPrefix}) => ${targetUrl}`);

  let lastError;
  for (let i = 0; i <= retryCount; i += 1) {
    try {
      return await axios({
        method: req.method,
        url: targetUrl,
        headers,
        params: req.query,
        data: req.body,
        timeout: timeoutMs,
        validateStatus: () => true,
      });
    } catch (err) {
      lastError = err;
      if (i < retryCount && isRetryable(err)) {
        await sleep(200 * (i + 1));
        continue;
      }
      throw lastError;
    }
  }
}