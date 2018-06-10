'use strict';

import Vue from 'vue'
const { ipcRenderer } = require('electron');
const i18n = require('i18next');
const express = require('express');
const scratch = express();
const router = express.Router();
const CorVal = new RegExp(/Got/);
const port = 5000;

i18n.init({
    lng: 'ja',
    debug: true,
    resources: {
        en: {
            translation: {
                "select": "Select",
                "refrash": "Refrash",
                "main": "Select SerialPort"
            }
        },
        ja: {
            translation: {
                "select": "えらぶ",
                "refrash": "こうしん",
                "main": "シリアルポートをえらぶ"
            }
        }
    }
}, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
});

let server;
let data = {
  selected: '',
  options: [],
  i18ns: {
    select: i18n.t("select"),
    refrash: i18n.t("refrash"),
    main: i18n.t("main")
  },
  selectedChecker: false,
  validation: {
    valid: false
  }
};

let status = {
  messages: [],
  validation: {
    valid: false
  }
};

let vm = new Vue({
  el: '#selectMenu',
  data: data,
  methods: {
    select: function (event) {
      if(!this.selectedChecker){
        ipcRenderer.send('selected', this.selected);
        ipcRenderer.once('init', (event, res) => {
          console.log("init: " + res);
          if(CorVal.test(res)){
            server = scratch.listen(port);
            status.messages = ['Connect Success!'];
          }else{
            const data = JSON.parse(res);
            status.messages = data.messages;
          }
        });
        ipcRenderer.on('communicate', (event, res) => {
          console.log("communicate: " + res);
        });
        this.selectedChecker = true;
      }
    },

    refrash: function (event) {
      if(server) server.close();
      ipcRenderer.send('refrash', "Refrash, Please!");
      ipcRenderer.once('init', (event, res) => {
        console.log("init: " + res);
        if(CorVal.test(res)){
          server = scratch.listen(port);
          status.messages = ['Refresh Success!'];
        }else{
          const data = JSON.parse(res);
          status.messages = data.messages;
        }
      });
    }
  }
});


let vm2 = new Vue({
  el: '#connectionStatus',
  data: status
});

ipcRenderer.on('lang', (event, res) => {
    i18n.changeLanguage(res);
    const newI18ns = {
        select: i18n.t("select"),
        refrash: i18n.t("refrash"),
        main: i18n.t("main")
    };
    data.i18ns = newI18ns;
    console.log(data.i18ns);
})

ipcRenderer.on('list', (event, res) => {
  data.selected = res.selected;
  data.options = res.options;
  console.log("updated");
})

scratch.use('/', router);

router.get('/poll', (req, res) => {
  res.send(ipcRenderer.sendSync('poll', 'polling'));
});

router.get('/:pod/:id/:data', (req, res) => {
  ipcRenderer.send('write', [req.params.pod, req.params.data]);
  res.send("OK");
});

router.get('/:pod/:id', (req, res) => {
  ipcRenderer.send('read', req.params.pod);
  res.send("OK");
});
