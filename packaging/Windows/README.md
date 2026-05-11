# 情绪花园 — 数字沙盘 (Windows Electron App)

## 概述

将"情绪花园 — 数字沙盘"打包成 Windows 桌面应用。使用 Electron 框架，支持 Windows 10/11。

## 先决条件

- **Node.js** 18+ (推荐 20 LTS)：[https://nodejs.org](https://nodejs.org)
- **Git**（可选，用于克隆仓库）

## 快速启动（开发模式）

```bash
# 进入 Windows 打包目录
cd packaging\Windows

# 安装依赖
npm install

# 启动应用（开发模式）
npm start
```

## 打包构建

### 方式一：使用 build.bat（交互式）

```bash
cd packaging\Windows
build.bat
```

按提示选择：
1. **Build installer (NSIS)** — 生成安装包
2. **Build portable .exe** — 生成免安装便携版
3. **Package only** — 仅打包目录
4. **Start app** — 直接启动（不打包）

### 方式二：使用 npm scripts

```bash
# 生成安装包
npm run build:win

# 生成便携版 .exe
npm run build:portable

# 仅打包目录（不压缩）
npm run pack
```

## 构建产物

构建完成后，输出位于 `packaging/Windows/dist/` 目录：

| 格式 | 文件 | 说明 |
|------|------|------|
| NSIS 安装包 | `情绪花园-Setup-1.0.0.exe` | 标准 Windows 安装程序 |
| 便携版 | `情绪花园-1.0.0-portable.exe` | 免安装，直接运行 |
| 打包目录 | `win-unpacked/` | 未压缩的应用目录 |

## 项目结构

```
packaging/Windows/
├── main.js              # Electron 主进程
├── package.json         # 项目配置 + 构建配置
├── index.html           # 启动加载页面
├── build.bat            # Windows 构建脚本
├── assets/              # 应用图标等静态资源
│   └── icon.png
├── 情绪花园_数字沙盘.html  # 复制自项目根目录
└── README.md            # 本文件
```

## 特性

- 原生 Windows 窗口体验
- 全离线运行
- 支持 Windows 10/11
- 可生成安装包或便携版
- 中文菜单支持
- F12 开发者工具

## 常见问题

**Q: 构建报错 "electron-builder not found"**
A: 运行 `npm install` 确保依赖安装完成

**Q: 启动时白屏/黑屏**
A: 确保 `情绪花园_数字沙盘.html` 存在于当前目录。build.bat 会自动从项目根目录复制

**Q: 如何自定义图标？**
A: 将 256x256 的 PNG 或 ICO 文件放入 assets/ 目录
