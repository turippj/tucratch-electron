'use strict';

const ComWithPod = require('./ComWithPod');
const PodRepository = require('../repository/PodRepository');

module.exports = class ComWithScratch {
  static poll() {
    const varList = PodRepository.getVarList();
    let dataStr = "";
    const keys = Object.keys(varList);
    keys.forEach((key) => {
      dataStr = dataStr + key + " " + varList[key] + "\n";
    });
    return dataStr;
  }

  static podRead(pod, sp) {
    const getPod = PodRepository.getPod(pod);
    const message = "get " + "/" + getPod.id + "/" + getPod.port + "\n";
    return ComWithPod.communicate(message, sp);
  }

  static podWrite(pod, data, sp) {
    const getPod = PodRepository.getPod(pod);
    const message = "post " + "/" + getPod.id + "/" + getPod.port + " " + data + "\n";
    return ComWithPod.communicate(message, sp);
  }
};
