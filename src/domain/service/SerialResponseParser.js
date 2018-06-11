'use strict';

const PodRepository = require('../repository/PodRepository');
const JsonFactory = require('../factory/JsonFactory');
const path = require('path');
const i18n = require('i18next');
const hasPost = new RegExp(/post/);
const hasGet = new RegExp(/get/);

module.exports = class SerialResponseParser {
  static responseParser(event, gotMessage, sendedMessage) {
    if(!gotMessage) {
      console.log('Get Message False Error.');
      return false;
    }else{

      if(sendedMessage == '/\n') {
        this.initPodList(gotMessage).then((res) => {
          if(res.length == 0){
            event.sender.send('init', 'Got: ' + gotMessage);
            //event.sender.send('init', 'Sended: ' + sendedMessage);
          }else{
            console.log(res);
            const err = {'messages': res};
            event.sender.send('init', JSON.stringify(err));
          }
        });

      }else if(hasPost.test(sendedMessage)) {
        event.sender.send('communicate', 'Got: ' + gotMessage);
        event.sender.send('communicate', 'Sended: ' + sendedMessage);
        this.getPostingResult(gotMessage);

      }else if(hasGet.test(sendedMessage)) {
        event.sender.send('communicate', 'Got: ' + gotMessage);
        event.sender.send('communicate', 'Sended: ' + sendedMessage);
        this.setResponseData(gotMessage);

      }else{
        console.log('Invalid Message Syntax Error.');
        return false;
      }
      return true;
    }
  }

  static async initPodList(gotMessage) {
    PodRepository.clearStorage();
    const reply = JSON.parse(gotMessage);
    let pods = reply.bridge;
    let errMessage = [];
    if(pods) {
      for(let pod of pods) {
        let res = await PodRepository.setPod(pod);
        if (res != 0) errMessage.push(res);
      }
    }else{
      errMessage.push("Error: Any Tpod modules not connected.");
    }

    setTimeout(() => {
      JsonFactory.makeJson();
    }, 1000);

    if (errMessage != []) {
      return errMessage;
    } else {
      return 0;
    }
  }

  static getPostingResult(gotMessage) {
  }

  static setResponseData(gotMessage) {
    try {
      const reply = JSON.parse(gotMessage);
      const podsList = PodRepository.getPodsList();
      let varList = PodRepository.getVarList();

      podsList.forEach((pod) => {
        if(pod.split('_')[1] == i18n.t('read')) {
          const gotPod = PodRepository.getPod(pod);
          if(gotPod.id == reply.id && gotPod.port == reply.port) {
            varList[pod.split('_')[0]] = reply.data;
            PodRepository.setVarList(varList);
          }
        }
      });
    } catch (e){
      console.log(e);
    }

  }
}
