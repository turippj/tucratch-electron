'use strict'

const PodFactory = require('../factory/PodFactory');
const fetch = require('node-fetch');
const LocalStorage = require('node-localstorage').LocalStorage;
let localStorage = new LocalStorage('./scratch');

module.exports = class PodRepository {
  static async setPod(id){
    const manifest_id = id.split('-')[0];
    const URL = 'https://manifest.turip.org/';
    const json =  await fetch(URL + manifest_id).then((response) => {
                            return response.json();
                          });
    if(json != "404") {
      for(let port of json['port']){
        const podData = {
                          'name'  : String.raw`${json['name'].replace(/ /g,"-")}-${port['name']}`,
                          'type'  : port['type'],
                          'port'  : port['number'],
                          'id'    : id,
                          'method': 'read'
                        }
        if(port['permission'] == 'W') {
          podData['method'] = 'write';
          this.setToStrage(podData);
        } else if(port['permission'] == 'RW') {
          this.setToStrage(podData);

          podData['method'] = 'write';
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
    return JSON.parse(localStorage.getItem(name));
  }

  static getPodsList() {
    return JSON.parse(localStorage.getItem('podsList'));
  }

  static getVarList() {
    return JSON.parse(localStorage.getItem('varList'));
  }

  static setVarList(varList) {
    localStorage.setItem('varList', JSON.stringify(varList));
  }

  static setToStrage(podData) {
    const name = podData['name']
    localStorage.setItem(name +'_'+ podData['method'], JSON.stringify(PodFactory.addPod(podData)));

    const getVarList = localStorage.getItem('varList');
    if(podData['method'] == 'read') {
      if(getVarList){
        let varList = JSON.parse(getVarList);
        varList[name] = 0;
        localStorage.setItem('varList', JSON.stringify(varList));
      }else{
        const varList = {[name]: 0};
        localStorage.setItem('varList', JSON.stringify(varList));
      }
    }

    const getPodsList = localStorage.getItem('podsList');
    if(getPodsList){
      let podsList = JSON.parse(getPodsList);
      podsList.push(name +'_'+ podData['method']);
      localStorage.setItem('podsList', JSON.stringify(podsList));
    }else{
      const podsList = [name +'_'+ podData['method']];
      localStorage.setItem('podsList', JSON.stringify(podsList));
    }
  }

  static onRejected(err) {
    console.log(err);
  }

}
