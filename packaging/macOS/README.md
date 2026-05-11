# 情绪花园 — 数字沙盘 (macOS .app)

## 概述

将"情绪花园 — 数字沙盘"单页 Web 应用打包成原生 macOS `.app` 应用。使用 Swift + WebKit 构建，离线运行，原生窗口体验。

## 先决条件

- macOS 10.15 (Catalina) 或更高版本
- Xcode Command Line Tools

```bash
xcode-select --install
```

## 构建步骤

```bash
# 进入 macOS 打包目录
cd packaging/macOS

# 赋予构建脚本执行权限（首次）
chmod +x build.sh

# 运行构建脚本
./build.sh
```

构建完成后，`.app` 包位于 `packaging/macOS/build/情绪花园.app`。

## 直接启动

```bash
open packaging/macOS/build/情绪花园.app
```

## 打包成 DMG（可选）

构建脚本输出中已包含 DMG 命令，或直接运行：

```bash
hdiutil create -volname "情绪花园" \
  -srcfolder "packaging/macOS/build/情绪花园.app" \
  -ov -format UDZO "packaging/macOS/build/情绪花园.dmg"
```

## 项目结构

```
packaging/macOS/
├── 情绪花园/                # Xcode 项目源文件
│   ├── AppDelegate.swift    # Swift 入口 + WebKit 包装
│   └── Info.plist           # 应用元信息配置
├── build.sh                 # 自动构建脚本
└── README.md                # 本文件
```

## 特性

- 原生 macOS 窗口（标题栏透明，可拖拽）
- 全离线运行（加载打包的本地 HTML 文件）
- 高分辨率 Retina 支持
- 自动禁止系统休眠
- 关闭窗口即退出应用

## 注意事项

- 如果 HTML 文件中包含外部网络资源，需要网络连接才能正常显示
- HTML 文件路径在 `build.sh` 中硬编码，如需调整请修改 `HTML_SOURCE` 变量
