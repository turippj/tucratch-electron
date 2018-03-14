'use strict';

import Vue from 'vue'
const { ipcRenderer } = require('electron');
const express = require('express');
const scratch = express();
const router = express.Router();
const CorVal = new RegExp(/Got/);
const port = 5000;

let server;
let data = {
  selected: '',
  options: [],
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

ipcRenderer.on('list', (event, res) => {
  data.selected = res.selected;
  data.options = res.options;
  console.log("updated");
})

scratch.use('/', router);

router.get('/poll', (req, res) => {
  res.send(ipcRenderer.sendSync('poll', 'polling'));
  num++;
});

router.get('/:pod/:id/:data', (req, res) => {
  ipcRenderer.send('write', [req.params.pod, req.params.data]);
  res.send("OK");
});

router.get('/:pod/:id', (req, res) => {
  ipcRenderer.send('read', req.params.pod);
  res.send("OK");
});
