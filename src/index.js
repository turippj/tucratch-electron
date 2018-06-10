const {app, ipcMain, BrowserWindow, Menu, Tray} = require('electron');
const path = require('path');
const url = require('url');
const i18n = require('i18next');
const ComWithPod = require('./domain/service/ComWithPod');
const ComWithScratch = require('./domain/service/ComWithScratch');
const PodRepository = require('./domain/repository/PodRepository');

let sp;
let parser;
let sended = {'message': ""};
let mainWindow;

global.appPath = app.getPath('exe');

i18n.init({
    lng: 'ja',
    debug: true,
    resources: {
        en: {
            translation: {
                "read": "read",
                "write": "write"
            }
        },
        ja: {
            translation: {
                "read": "よみこむ",
                "write": "かきこむ"
            }
        }
    }
}, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
});


function createWindow () {
  mainWindow = new BrowserWindow({width: 400, height: 195, resizable: true});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'ui', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  ComWithPod.getSerialList().then((data) => {
    setTimeout(function(){
      mainWindow.webContents.send( 'list', data );
    }, 1000);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });

  const menu = Menu.buildFromTemplate([
      {
          label: 'Quit',
          accelerator: 'CmdOrCtrl+Q',
          role: 'quit'
      },
      {
          label: 'Language',
          submenu: [
              {
                  label: 'にほんご',
                  type: 'normal',
                  click: () => {
                    i18n.changeLanguage('ja');
                    mainWindow.webContents.send( 'lang', 'ja' );
                  }
              },
              {
                  label: 'English',
                  type: 'normal',
                  click: () => {
                      i18n.changeLanguage('en');
                      mainWindow.webContents.send( 'lang', 'en' );
                  }
              }
          ]
      },
      {
          label: 'View',
          submenu: [
              {
                  label: 'Reload',
                  accelerator: 'Command+R',
                  click: function() { mainWindow.restart(); }
              },
              {
                  label: 'Toggle Full Screen',
                  accelerator: 'Ctrl+Command+F',
                  click: function() { mainWindow.setFullScreen(!mainWindow.isFullScreen()); }
              },
              {
                  label: 'Toggle Developer Tools',
                  accelerator: 'Alt+Command+I',
                  click: function() { mainWindow.toggleDevTools(); }
              },
          ]
      }
  ]);

  Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('selected', (event, arg) => {
  let init = ComWithPod.initialize(arg);
  sp = init.sp;
  parser = init.parser;
  sended.message = ComWithPod.getTpodList(sp);
  ComWithPod.setUpReader(event, parser, sended);
});

ipcMain.on('refrash', (event) => {
  sended.message = ComWithPod.getTpodList(sp);
});

ipcMain.on('poll', (event, arg) => {
  event.returnValue = ComWithScratch.poll();
});

ipcMain.on('read', (event, arg) => {
  sended.message = ComWithScratch.podRead(arg, sp);
});

ipcMain.on('write', (event, arg) => {
  sended.message = ComWithScratch.podWrite(arg[0], arg[1], sp);
});
