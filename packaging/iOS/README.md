# 情绪花园 — 数字沙盘 (iOS PWA)

## 概述

将"情绪花园 — 数字沙盘"作为**渐进式 Web 应用 (PWA)** 部署到 iOS 设备上。支持添加到主屏幕，离线运行，获得接近原生应用的体验。

## 效果

- ✅ 添加到 iOS 主屏幕（全屏启动，无浏览器地址栏）
- ✅ 离线运行（Service Worker 缓存）
- ✅ 自定义图标（iOS 圆角适配）
- ✅ 自定义启动画面主题色

## 部署方式

### 方式一：直接部署到 Web 服务器（推荐）

1. 将以下文件上传到你的 Web 服务器根目录：

   ```
   ├── 情绪花园_数字沙盘.html    # 主应用（从项目根目录复制）
   ├── manifest.json              # PWA 配置
   ├── service-worker.js          # 离线缓存
   └── icons/                     # 应用图标
       ├── icon-120.png
       ├── icon-152.png
       ├── icon-167.png
       ├── icon-180.png
       ├── icon-192.png
       ├── icon-512.png
       └── icon-1024.png
   ```

2. 在 `情绪花园_数字沙盘.html` 的 `<head>` 中添加：

   ```html
   <!-- PWA Manifest -->
   <link rel="manifest" href="manifest.json">

   <!-- iOS Safari 支持 -->
   <meta name="apple-mobile-web-app-capable" content="yes">
   <meta name="apple-mobile-web-app-status-bar-style" content="default">
   <meta name="apple-mobile-web-app-title" content="情绪花园">
   <meta name="mobile-web-app-capable" content="yes">

   <!-- iOS 图标 -->
   <link rel="apple-touch-icon" sizes="120x120" href="icons/icon-120.png">
   <link rel="apple-touch-icon" sizes="152x152" href="icons/icon-152.png">
   <link rel="apple-touch-icon" sizes="167x167" href="icons/icon-167.png">
   <link rel="apple-touch-icon" sizes="180x180" href="icons/icon-180.png">

   <!-- Service Worker 注册 -->
   <script>
     if ('serviceWorker' in navigator) {
       window.addEventListener('load', () => {
         navigator.serviceWorker.register('/service-worker.js');
       });
     }
   </script>
   ```

### 方式二：本地测试（localhost）

如果仅想在本地测试 PWA 功能：

```bash
# 使用 Python 快速启动 HTTP 服务器
cd /Users/pengzhan/Documents/hermes-docs/emotion-garden-sandplay
python3 -m http.server 8080
```

然后在 iOS Safari 中访问 `http://<你的IP>:8080`。

## 在 iOS Safari 上添加到主屏幕

### 步骤

1. **打开 Safari**，访问部署好的 PWA 页面

2. **点击分享按钮**（底部工具栏中间的方框箭头图标）

   ![Share Button](https://support.apple.com/library/content/dam/edam/applecare/images/en_US/iOS/ios15-iphone12-pro-safari-share-button.png)

3. **向下滚动**，点击 **"添加到主屏幕"** (Add to Home Screen)

   ![Add to Home Screen](https://support.apple.com/library/content/dam/edam/applecare/images/en_US/iOS/ios14-iphone11-pro-safari-add-to-home-screen.png)

4. **确认名称**，点击右上角 **"添加"**

5. 现在主屏幕上会出现 🌱 图标，点击即可全屏启动

### 注意事项

| 项目 | 说明 |
|------|------|
| iOS 版本要求 | iOS 12.2+（推荐 iOS 14+ 以获得最佳 PWA 支持） |
| 离线支持 | 首次访问后自动缓存，下次离线也可运行 |
| 推送通知 | iOS 16.4+ 支持 Web Push API（需额外配置） |
| 存储限制 | 每个 PWA 上限约 50MB（取决于设备） |

## 生成图标

使用 `icons/generate-icons.html` 工具生成图标：

1. 在浏览器中打开 `icons/generate-icons.html`
2. 点击 **"生成并下载所有图标"** 按钮
3. 将下载的图标放入 `icons/` 目录

或者使用任意图像工具手动创建：
- 应用会使用圆形渐变背景 + 花/植物元素 + 🌱 emoji
- iOS 会自动为图标添加圆角
- 建议使用 1024×1024 作为源图

## 项目结构

```
packaging/iOS/
├── manifest.json              # Web App Manifest
├── service-worker.js          # 离线缓存 Service Worker
├── icons/
│   ├── generate-icons.html    # 图标生成工具（浏览器打开）
│   ├── icon-120.png           # (生成后)
│   ├── icon-152.png           # (生成后)
│   ├── icon-167.png           # (生成后)
│   ├── icon-180.png           # (生成后)
│   ├── icon-192.png           # (生成后)
│   ├── icon-512.png           # (生成后)
│   └── icon-1024.png          # (生成后)
└── README.md                  # 本文件
```

## HTML 文件需要添加的头部标签

将以下标签添加到 `情绪花园_数字沙盘.html` 的 `<head>` 中以确保最佳 PWA 体验：

```html
<!-- Viewport for mobile -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">

<!-- PWA -->
<link rel="manifest" href="manifest.json">

<!-- iOS -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="情绪花园">

<!-- iOS Icons -->
<link rel="apple-touch-icon" sizes="120x120" href="icons/icon-120.png">
<link rel="apple-touch-icon" sizes="152x152" href="icons/icon-152.png">
<link rel="apple-touch-icon" sizes="167x167" href="icons/icon-167.png">
<link rel="apple-touch-icon" sizes="180x180" href="icons/icon-180.png">

<!-- Service Worker -->
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js');
    });
  }
</script>
```
