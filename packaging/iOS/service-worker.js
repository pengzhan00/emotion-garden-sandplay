/**
 * 情绪花园 — 数字沙盘 Service Worker
 * 
 * 提供离线缓存支持，确保应用在无网络环境下正常运行。
 * 
 * 安装策略: 预缓存所有核心资源
 * 更新策略: Cache First, fallback to Network
 * 缓存版本: v1
 */

const CACHE_NAME = 'emotion-garden-sandplay-v1';
const CACHE_VERSION = 'v1';

// 要预缓存的核心资源
const PRECACHE_URLS = [
  '/',
  '/src/emotion-style.css',
  '/src/emotion-bundle.js',
  '/情绪花园_数字沙盘.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// 排除的外部 CDN 资源（这些无法离线缓存）
const EXTERNAL_DOMAINS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdnjs.cloudflare.com'
];

/**
 * 安装事件：预缓存核心资源
 */
self.addEventListener('install', (event) => {
  console.log(`[ServiceWorker] Install: ${CACHE_NAME}`);

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching core resources');
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        console.log('[ServiceWorker] Pre-cache complete');
        // 跳过等待，立即激活新版本
        return self.skipWaiting();
      })
      .catch((error) => {
        console.warn('[ServiceWorker] Pre-cache failed (some resources may be unavailable offline):', error);
      })
  );
});

/**
 * 激活事件：清理旧缓存
 */
self.addEventListener('activate', (event) => {
  console.log(`[ServiceWorker] Activate: ${CACHE_NAME}`);

  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (currentCaches.indexOf(cacheName) === -1) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete, taking control');
        // 立即控制所有客户端，无需刷新
        return self.clients.claim();
      })
  );
});

/**
 * 判断请求是否来自外部 CDN（无法离线缓存）
 */
function isExternalRequest(url) {
  try {
    const requestUrl = new URL(url);
    return EXTERNAL_DOMAINS.some(domain => requestUrl.hostname.includes(domain));
  } catch (e) {
    return false;
  }
}

/**
 * 判断是否是导航请求（HTML 页面）
 */
function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         (request.method === 'GET' &&
          request.headers.get('Accept') &&
          request.headers.get('Accept').includes('text/html'));
}

/**
 * 获取请求的完整 URL（处理相对路径）
 */
function getFullUrl(request) {
  return request.url || request;
}

/**
 * 拦截请求事件：Cache First 策略
 */
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 跳过非 GET 请求
  if (request.method !== 'GET') return;

  // 跳过外部 CDN 请求（让浏览器默认行为处理）
  if (isExternalRequest(request.url)) return;

  // 跳过 chrome-extension 等协议
  if (!request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // Cache Hit: 返回缓存的响应
          // 同时在后台更新缓存（stale-while-revalidate）
          if (isNavigationRequest(request)) {
            // 对于 HTML 页面，后台更新缓存
            fetch(request)
              .then((networkResponse) => {
                if (networkResponse && networkResponse.ok) {
                  const responseToCache = networkResponse.clone();
                  caches.open(CACHE_NAME)
                    .then((cache) => {
                      cache.put(request, responseToCache);
                    });
                }
              })
              .catch(() => {
                // 网络不可用，使用缓存即可
              });
          }
          return cachedResponse;
        }

        // Cache Miss: 尝试网络请求
        return fetch(request)
          .then((networkResponse) => {
            // 只缓存成功的响应
            if (networkResponse && networkResponse.ok) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            // 网络不可用且无缓存：返回离线页面
            console.warn('[ServiceWorker] Fetch failed, network unavailable:', request.url);

            // 如果是导航请求，尝试返回缓存的首页
            if (isNavigationRequest(request)) {
              return caches.match('/情绪花园_数字沙盘.html')
                .then((cachedHtml) => {
                  if (cachedHtml) return cachedHtml;
                  // 最后兜底：返回简单的离线提示
                  return new Response(
                    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>离线</title><style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#FF9A9E;color:#fff;text-align:center}</style></head><body><h1>🌱 情绪花园</h1><p>当前处于离线状态，请检查网络连接后重试。</p></body></html>',
                    { headers: { 'Content-Type': 'text/html; charset=UTF-8' } }
                  );
                });
            }
            return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
          });
      })
  );
});

/**
 * 消息事件：处理来自页面的通信
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[ServiceWorker] Skip waiting requested');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_STATUS') {
    // 返回缓存状态
    caches.open(CACHE_NAME)
      .then((cache) => {
        cache.keys()
          .then((keys) => {
            event.ports[0].postMessage({
              type: 'CACHE_STATUS_REPLY',
              cacheName: CACHE_NAME,
              entries: keys.length,
              urls: keys.map(k => k.url)
            });
          });
      });
  }
});

/**
 * 推送事件（预留，将来可用于推送通知）
 */
self.addEventListener('push', (event) => {
  const title = '情绪花园';
  const options = {
    body: event.data ? event.data.text() : '来记录你的心情吧 🌱',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-192.png'
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});
