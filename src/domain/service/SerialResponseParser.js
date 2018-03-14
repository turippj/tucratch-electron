const PodRepository = require('../repository/PodRepository');
const JsonFactory = require('../factory/JsonFactory');
const fsExtra = require('fs-extra');
const hasPost = new RegExp(/POST/);
const hasGet = new RegExp(/GET/);

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
    fsExtra.emptyDirSync('../../../scratch');
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
      JsonFactory.makeJson('./json');
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
    const reply = JSON.parse(gotMessage);
    const podsList = PodRepository.getPodsList();
    let varList = PodRepository.getVarList();

    podsList.forEach((pod) => {
      if(pod.split('_')[1] == 'read') {
        const gotPod = PodRepository.getPod(pod);
        if(gotPod.id == reply.id && gotPod.port == reply.port) {
          varList[pod.split('_')[0]] = reply.data;
          PodRepository.setVarList(varList);
        }
      }
    });
  }
}
