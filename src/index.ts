import { app, BrowserWindow, Menu } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';
import { enableLiveReload } from 'electron-compile';
// tslint:disable-next-line: no-require-imports
import { store } from './config';

// export let store = new ElectronStore({
//   name: 'userConfig',
//   cwd: `${__dirname}`,
//   defaults: {
//       'api': 'test',
//       'qboxes': [
//           {
//               'name': 'QBox Name',
//               'type': 'QBox Type',
//               'macAddress': 'QBox Mac Address',
//               'ipAddress': 'QBox IP Address'
//           }
//       ],
//       'checked': true
//   }
// });

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: Electron.BrowserWindow | null = null;

const isDevMode = process.execPath.match(/[\\/]electron/);

if (isDevMode) {
  enableLiveReload({strategy: 'react-hmr'});
}

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
  });
  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  const template: Array<any> = [
    {
      label: 'Show',
      submenu: [
        {
          label: 'New show',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('newShow', '/newShow');
          },
          accelerator: 'Ctrl+N'
        },
        {
          label: 'Open show',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('openShow', '/openShow');
          },
          accelerator: 'Ctrl+O'
        },
        {
          label: 'Save show',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('saveShow', 'saveShow');
          },
          accelerator: 'Ctrl+S'
        },
        { type: 'separator' },
        {
          label: 'Auto Save',
          type: 'checkbox',
          checked: store.get('checked'),
          click () { store.set('checked', !store.get('checked')); }
        },
        { type: 'separator' }
      ]
    },
    {
      label: 'Run',
      submenu: [
        {
          label: 'Go',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('go', 'go');
          },
          accelerator: 'Ctrl+Enter'
        },
        {
          label: 'Request Acknowledgement',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('ack', 'ack');
          },
          accelerator: 'Ctrl+Space'
        },
        { type: 'separator' },
        {
          label: 'Toggle Run Mode',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('toggleRunMode', 'toggleRunMode');
          },
          accelerator: 'Ctrl+R'
        },
        {
          label: 'Toggle Auto-Run Mode',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('toggleAutoRunMode', 'toggleAutoRunMode');
          },
          accelerator: 'Ctrl+Shift+R'
        },
        {
          label: 'Toggle  Editable Run Mode',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('toggleEditRunMode', 'toggleEditRunMode');
          },
          accelerator: 'Ctrl+Alt+R'
        },
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' },
        { type: 'separator' },
        {
          label: 'Utilities',
          click () {
            // tslint:disable-next-line: no-unused-expression
            mainWindow !== null && mainWindow.webContents.send('openPreferences', '/settings');
          },
          accelerator: 'Ctrl+P'
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'About',
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    template[1].submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    );

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS);
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
