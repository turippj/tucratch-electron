'use strict'

const path = require('path');
const fs = require('fs');
const PodRepository = require('../repository/PodRepository');

module.exports = class JsonFactory {
  static makeJson(JSONPATH) {
    //Check tucratch.json not existing
    if(this.isExistFile(JSONPATH + '/tucratch.json')) fs.unlinkSync(JSONPATH + '/tucratch.json');

    let json = { "extensionName": "tucratch",
                 "extensionPort": 5000,
                 "blockSpecs": [] };

    const podsList = PodRepository.getPodsList();
    if(podsList) {
      for(let pod of podsList) {
        const podData = PodRepository.getPod(pod);
        if(podData){
          if(podData['method'] == 'read'){
            json['blockSpecs'].push(['w', pod, pod]);
            json['blockSpecs'].push(['r', podData['name'], podData['name']]);
          }else if(podData['method'] == 'write'){
            json['blockSpecs'].push(['w', pod + " %n", pod]);
          }
        }
      }
    }else{
      return false;
    }
    fs.writeFile(JSONPATH + '/tucratch.json', JSON.stringify(json, null, '    '));
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
}
