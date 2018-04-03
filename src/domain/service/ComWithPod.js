const serialPort = require('serialport');
const Readline = serialPort.parsers.Readline;
const SerialResponseParser = require('./SerialResponseParser');
const re2 = new RegExp("/");
const re = new RegExp(/^Arduino/);

module.exports = class ComWithPod {
  static async getSerialList() {
    let data = {
      selected: '',
      options: []
    };
    const ports = await serialPort.list();
    ports.forEach((port) => {
      if (port.manufacturer && port.manufacturer.match(re)) {
        data.selected = port.comName;
      }
      data.options.push({text: port.comName, value: port.comName});
    });
    return data;
  }

  static initialize(comName) {
    console.log(comName);
    const sp = new serialPort(comName, { bandrate: 9600,
                                         dataBits: 8,
                                         parity: 'none',
                                         stopBits: 1,
                                         flowControl: false });

    const parser = sp.pipe(new Readline({ delimiter: '\r\n' }));
    return {sp, parser};
  }

  static communicate(message, sp) {
    sp.write(message.slice(message.search(re2)-1));
    return message;
  }

  static getTpodList(sp) {
    const message = "/\n";
    setTimeout(function(){
      sp.write(message);
    }, 2000);
    return message;
  }

  static setUpReader(event, parser, sended){
    parser.on('data', function(res) {
      SerialResponseParser.responseParser(event, res, sended.message);
    });
  }
}
