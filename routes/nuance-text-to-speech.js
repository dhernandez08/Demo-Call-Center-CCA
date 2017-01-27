/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var Nuance = require('nuance');
var appID = "NMDPTRIAL_noelianavarro30_gmail_com20170113102410"; //Your appID.
var appKey = "5e38e5a8591f0d73f3065f018a5166ef8da6534ddb102cd890d7d2f3a12fb8ff679da7c0bdb433b0ba92b244e3183471be87be9a98ea7228c2441b6373d462da"; //Your appKey.
var fs = require('fs');
var path = require('path');


module.exports = function (app) {
    app.get('/api/nuance-text-to-speech/:text',  (req, res, next) =>  {
        //?param1=value1&param2=value2
        console.log("Iniciando post");
        console.log("Por reproducir en Nuance: " + req.params.text);
        console.log ("PARAM VOICE:" + req.query.voice);
        console.log ("PARAM VOICE VARIANT:" + req.query.varnt);
        var voice = req.query.voice;
        var voiceVariant = req.query.varnt;
        var msn = req.params.text;
        var nuance = new Nuance(appID, appKey);
       
      
      //Sends a TTS (text-to-speech) request to Nuance.
    var responseAudio = nuance.sendTTSRequest({
            "text": msn,
            "output": "public/audios/testFile.wav",
            "outputFormat": "wav",
            "language": voiceVariant,
            "voice": voice,
            "identifier": "randomIdentifierStringHere",
            "success": function(file){
                console.log("The file was saved.");
                //res.send(file.path);
                
                var filePath = path.join(__dirname.replace('routes',''), file.path);

                console.log(filePath);

     var stat = fs.statSync(filePath);
                console.log(stat.size);
                res.writeHead(200, {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': stat.size,
                    'X-Content-Type-Options': 'nosniff',
                     'Accept-Ranges':'bytes'
                });

                var readStream = fs.createReadStream(filePath);

                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.on('open', function () {
                readStream.pipe(res);
                
                });

                readStream.on('end', function () {
                  console.log("finaliza");
                 })      
            } ,
                "error": function(response){
                console.log("An error was occurred");
                console.log(response);
            }
        });
    
         console.log(appID);
       
    });


};
