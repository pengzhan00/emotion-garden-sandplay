const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: '🌱 情绪花园 — 数字沙盘',
    icon: path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true
    },
    backgroundColor: '#FF9A9E',
    show: false
  });

  // Load the local HTML file
  const htmlPath = path.join(__dirname, '情绪花园_数字沙盘.html');
  mainWindow.loadFile(htmlPath);

  // Show window when ready to avoid flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Build application menu
  const menuTemplate = [
    {
      label: '文件',
      submenu: [
        {
          label: '重新加载',
          accelerator: 'CmdOrCtrl+R',
          click: () => { mainWindow.reload(); }
        },
        {
          label: '开发者工具',
          accelerator: 'F12',
          click: () => { mainWindow.webContents.toggleDevTools(); }
        },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { role: 'resetZoom', label: '重置缩放' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' }
      ]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于 情绪花园',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: '关于 情绪花园',
              message: '🌱 情绪花园 — 数字沙盘',
              detail: '版本 1.0.0\n\n用 Three.js 构建的互动数字沙盘，\n表达情绪，创造属于你的心灵花园。\n\nGitHub: https://github.com/pengzhan00/emotion-garden-sandplay'
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Handle window close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// macOS: re-create window when dock icon clicked
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.whenReady().then(createWindow);
