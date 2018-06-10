'use strict'

const PodFactory = require('../factory/PodFactory');
const fetch = require('node-fetch');
const storage = require('electron-json-storage-sync');
const path = require('path');
const fs = require('fs');
const i18n = require('i18next');
const _ = require('underscore');
const manifest_ja = JSON.parse(fs.readFileSync(path.resolve('ja', 'manifestList.json'), 'utf8'));

module.exports = class PodRepository {
  static async setPod(id){
    const manifest_id = id.split('-')[0];
    const URL = 'https://manifest.turip.org/';
    let json;

    if( i18n.language == 'ja' && _.find(manifest_ja["list"], (num) => { return manifest_id == num; })) {
        json = JSON.parse(fs.readFileSync(path.resolve('ja', manifest_id+'.json'), 'utf8'));
    } else {
        json =  await fetch(URL + manifest_id).then((response) => {
            return response.json();
        });
    }

    if(json != "404") {
      for(let port of json['port']){
        const podData = {
                          'name'  : String.raw`${json['name'].replace(/ /g,"-")}-${port['name']}`,
                          'type'  : port['type'],
                          'port'  : port['number'],
                          'id'    : id,
                          'method': i18n.t('read')
                        }
        if(port['permission'] == 'W') {
          podData['method'] = i18n.t('write');
          this.setToStrage(podData);
        } else if(port['permission'] == 'RW') {
          this.setToStrage(podData);

          podData['method'] = i18n.t('write');
          this.setToStrage(podData);
        } else {
          this.setToStrage(podData);
        }
      }
      return 0;
    }else {
      return "Error: Manifest of " + manifest_id + " is not found.";
    }
  }

  static getPod(name) {
    return storage.get(name).data;
  }

  static getPodsList() {
    return storage.get('podsList').data;
  }

  static getVarList() {
    return storage.get('varList').data;
  }

  static setVarList(varList) {
    storage.set('varList', varList);
  }

  static clearStorage() {
    storage.clear();
  }

  static setToStrage(podData) {
    const name = podData['name']
    storage.set(name +'_'+ podData['method'], PodFactory.addPod(podData));

    const getVarList = storage.get('varList').data;
    if(podData['method'] == i18n.t('read')) {
      if(getVarList){
        let varList = getVarList;
        varList[name] = 0;
        storage.set('varList', varList);
      }else{
        const varList = {[name]: 0};
        storage.set('varList', varList);
      }
    }

    const getPodsList = storage.get('podsList').data;
    if(getPodsList){
      let podsList = getPodsList;
      podsList.push(name +'_'+ podData['method']);
      storage.set('podsList', podsList);
    }else{
      const podsList = [name +'_'+ podData['method']];
      storage.set('podsList', podsList);
    }
  }

  static onRejected(err) {
    console.log(err);
  }

}
