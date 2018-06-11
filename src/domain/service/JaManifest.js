'use strict';

module.exports = class JaManifest {
   constructor(){
       this.manifestList = [
           1001,
           1003,
           1005,
           1006,
           1007
       ];

       this.jaManifests = {
           "1001": {
               "model":"1001",
               "name":"LED",
               "description":"TURIP pot full color LED module.",
               "port":[
                   {
                       "number":1,
                       "name":"あか",
                       "description":"Output of LED Red (0-255).",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":2,
                       "name":"みどり",
                       "description":"Output of LED Green (0-255).",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":3,
                       "name":"あお",
                       "description":"Output of LED Blue (0-255).",
                       "permission":"RW",
                       "type":"int16"
                   }
               ]
           },

           "1003": {
               "model":"1003",
               "name":"かんきょう",
               "description":"TURIP pot environment sensor.",
               "port":[
                   {
                       "number":1,
                       "name":"おんど",
                       "description":"Temperature (Celsius).",
                       "permission":"RO",
                       "type":"float"
                   },
                   {
                       "number":2,
                       "name":"しつど",
                       "description":"humidity (%).",
                       "permission":"RO",
                       "type":"float"
                   },
                   {
                       "number":3,
                       "name":"きあつ",
                       "description":"Air pressure (Pa).",
                       "permission":"RO",
                       "type":"float"
                   },
                   {
                       "number":4,
                       "name":"あかるさ",
                       "description":"Illuminance (lx).",
                       "permission":"RO",
                       "type":"float"
                   }
               ]
           },

           "1005": {
               "model":"1005",
               "name":"モーター",
               "description":"TURIP pot motor drivers.",
               "port":[
                   {
                       "number":1,
                       "name":"1ばん",
                       "description":"Output of motor 1 (-255 - 255).",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":2,
                       "name":"2ばん",
                       "description":"Output of motor 2 (-255 - 255).",
                       "permission":"RW",
                       "type":"int16"
                   }
               ]
           },

           "1006": {
               "model":"1006",
               "name":"サーボ",
               "description":"TURIP pot RC servo control module.",
               "port":[
                   {
                       "number":1,
                       "name":"1ばん",
                       "description":"Servo1 output.",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":2,
                       "name":"2ばん",
                       "description":"Servo2 output.",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":3,
                       "name":"3ばん",
                       "description":"Servo3 output.",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":4,
                       "name":"4ばん",
                       "description":"Servo4 output.",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":5,
                       "name":"5ばん",
                       "description":"Servo5 output.",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":6,
                       "name":"6ばん",
                       "description":"Servo6 output.",
                       "permission":"RW",
                       "type":"int16"
                   }
               ]
           },

           "1007": {
               "model":"1007",
               "name":"つまみ",
               "description":"TURIP pot encoder I/F module.",
               "port":[
                   {
                       "number":1,
                       "name":"かいてんすう",
                       "description":"Output of encoder value.",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":2,
                       "name":"ボタン",
                       "description":"Output of button state.",
                       "permission":"RO",
                       "type":"bool"
                   },
                   {
                       "number":3,
                       "name":"ラッチボタン",
                       "description":"Output of button latch state.",
                       "permission":"RO",
                       "type":"bool"
                   },
                   {
                       "number":4,
                       "name":"LEDあか",
                       "description":"Output of LED Red (0-255).",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":5,
                       "name":"LEDみどり",
                       "description":"Output of LED Green (0-255).",
                       "permission":"RW",
                       "type":"int16"
                   },
                   {
                       "number":6,
                       "name":"LEDあお",
                       "description":"Output of LED Green (0-255).",
                       "permission":"RW",
                       "type":"int16"
                   }
               ]
           }
       };
   }

   getManifestList() {
       return this.manifestList
   }

   getManifests(num) {
       return this.jaManifests[num]
   }
};
