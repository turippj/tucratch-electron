'use strict';

const {app} = require('electron');
const fs = require('fs');
const i18n = require('i18next');
const PodRepository = require('../repository/PodRepository');
const appPath = app.getPath('home');
module.exports = class JsonFactory {
  static makeJson() {
    //Check tucratch.json not existing
    if(this.isExistFile(appPath + '/Documents/tucratch/tucratch.json')) fs.unlinkSync(appPath + '/Documents/tucratch/tucratch.json');

    let json = { "extensionName": "tucratch",
                 "extensionPort": 5000,
                 "blockSpecs": [] };

    const podsList = PodRepository.getPodsList();
    if(podsList) {
      for(let pod of podsList) {
        const podData = PodRepository.getPod(pod);
        if(podData){
          if(podData['method'] == i18n.t('read')){
            json['blockSpecs'].push(['w', pod, pod]);
            json['blockSpecs'].push(['r', podData['name'], podData['name']]);
          }else if(podData['method'] == i18n.t('write')){
            json['blockSpecs'].push(['w', pod + " %n", pod]);
          }
        }
      }
    }else{
      return false;
    }
    fs.writeFile(appPath + '/Documents/tucratch/tucratch.json', JSON.stringify(json, null, '    '));
    return true;
  }

  static isExistFile(file) {
    try {
      fs.statSync(file);
      return true
    } catch(err) {
      if(err.code === 'ENOENT') return false
    }
  }
};
