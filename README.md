# 情绪花园 — 数字沙盘

青少年情绪管理主题的 Three.js 3D 交互式沙盘。

## 项目结构

```
情绪花园_数字沙盘.html   ← 主入口（浏览器打开）
src/
  emotion-bundle.js       ← Three.js 沙盘逻辑
  emotion-style.css       ← 样式
render_emotion_garden.py  ← Blender 批量渲染脚本
assets/                   ← 导出的成品资产（渲染图、GLB、.blend 文件）
```

## 导出资产约定

所有渲染成品、GLB 模型、Blender 项目文件等导出资产统一存入 `assets/` 目录，随仓库一起推送至 GitHub。

## 使用流程

1. 浏览器打开 `情绪花园_数字沙盘.html`
2. 拖放沙具、记录心情
3. 点击「📦 导出 Blender」→ 下载 `.glb`
4. 运行 `render_emotion_garden.py` → 在 Blender 中自动渲染输出
