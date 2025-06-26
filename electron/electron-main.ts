import packageJson from '../package.json';
import path from 'node:path';
import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  nativeImage,
  RenderProcessGoneDetails,
  screen,
  session,
  Tray
} from 'electron';

const isDevelopment = process.env['ELECTRON_ENV'] === 'development';
const showDevTools = process.env['ELECTRON_DEV_TOOLS'] === 'show';

// eslint-disable-next-line @typescript-eslint/no-require-imports
if (require('electron-squirrel-startup')) {
  app.quit();
}

try {
  if (isDevelopment) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('electron-reloader')(module);
  }
} catch {
  console.error('Failed to require electron-reloader.');
}

let mainWindow: BrowserWindow;
let tray: Tray;

async function CreateMainWindow(): Promise<void> {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    title: packageJson.productName,
    icon: './dist/ephemera/browser/logo.ico',
    width: width,
    height: height,
    resizable: true,
    show: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDevelopment) {
    mainWindow.webContents.openDevTools();
  }

  const setTitle = () => {
    if (mainWindow) {
      mainWindow.title = `${packageJson.productName} - v${packageJson.version}`;
    }
  }

  await (isDevelopment ?
    mainWindow.loadURL('http://localhost:4200/').then(setTitle) :
    mainWindow.loadFile('./dist/ephemera/browser/index.html').then(setTitle)
  ).catch((err: Error) => { console.error(err.message); });

  mainWindow
    .webContents
    .on('render-process-gone', (event: Event, details: RenderProcessGoneDetails) => {
      if (details.reason === 'crashed') {
        if (mainWindow) {
          mainWindow.reload();
        }
      }
    });
}

function CreateMenu(): MenuItem[] {
  const menu = new Array<MenuItem>();
  menu.push(new MenuItem({
    label: '&File',
    submenu: [
      { role: 'reload' },
      { type: 'separator' },
      {
        label: '&Quit',
        accelerator: 'Ctrl+W',
        click: () => { app.quit(); }
      }
    ]
  }));

  if (showDevTools) {
    menu.push(new MenuItem({
      label: '&Development',
      submenu: [
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        {
          label: '&Clear LocalStorage',
          click: () => {
            session.defaultSession.clearStorageData({ storages: ['localstorage'] });
          }
        }
      ]
    }));
  }

  return menu;
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
    }
  });

  app.on('window-all-closed', () => {
    app.quit();
  });

  app.whenReady()
    .then(async () => {
      await CreateMainWindow();
      Menu.setApplicationMenu(Menu.buildFromTemplate(CreateMenu()));

      const trayIconPath = path.join(__dirname, '../../../public/logo.ico');
      console.log(trayIconPath);
      tray = new Tray(nativeImage.createFromPath(trayIconPath));
      tray.setToolTip('Ephemera');
      tray.on('right-click', () => {
        const contextMenu = Menu.buildFromTemplate([
          new MenuItem({
            label: '&Quit',
            click: () => { app.quit(); }
          })
        ]);
        tray.popUpContextMenu(contextMenu);
      });
    });
}