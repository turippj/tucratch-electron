'use strict';

module.exports = class Pod {
  constructor(name, type, port, id, method){
    this.name = name;
    this.type = type;
    this.port = port;
    this.id = id;
    this.method = method;
  }
};
