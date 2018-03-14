const {app, ipcMain, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');
const rmdir = require('rmdir');
const ComWithPod = require('./domain/service/ComWithPod');
const ComWithScratch = require('./domain/service/ComWithScratch');
const PodRepository = require('./domain/repository/PodRepository');

let sp;
let parser;
let sended = {'message': ""};
let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 450, height: 170, resizable: false});

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'ui', 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  ComWithPod.getSerialList().then(function(data){
    setTimeout(function(){
      mainWindow.webContents.send( 'list', data );
    }, 500);
  });

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  rmdir('./scratch')
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
})

ipcMain.on('read', (event, arg) => {
  sended.message = ComWithScratch.podRead(arg, sp);
})

ipcMain.on('write', (event, arg) => {
  sended.message = ComWithScratch.podWrite(arg[0], arg[1], sp);
})
