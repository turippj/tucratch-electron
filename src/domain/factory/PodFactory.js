'use strict'

const Pod = require('../entity/Pod');

module.exports = class PodFactory {
  static addPod(podData){
    const pod = new Pod(podData['name'], podData['type'], podData['port'],
                        podData['id'], podData['method']);
    return pod;
  }
}
