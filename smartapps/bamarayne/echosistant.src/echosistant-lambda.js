/**
 *  EchoSistant - Lambda Code
 *
 *  Copyright © 2016 Jason Headley
 *  Special thanks for Michael Struck @MichaelS (Developer of AskAlexa) for allowing me
 *  to build off of his base code.  Special thanks to Keith DeLong  @N8XD for his 
 *  assistance in troubleshooting.... as I learned.....  Special thanks to Bobby
 *  @SBDOBRESCU for jumping on board and being a co-consipirator in this adventure.
 *
 *  Version 3.1.2 - 12/11/2016  Bug Fix - JSON Error 
 *  Version 3.1.1 - 12/11/2016  Bug Fix - Continued Commands
 *  Version 3.1.0 - 12/7/2016
 *  Version 3.0.0 - 12/1/2016  Added new parent variables
 *  Version 2.0.0 - 11/20/2016  Continued Commands
 * 
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 *  in compliance with the License. You may obtain a copy of the License at:
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software distributed under the License is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License
 *  for the specific language governing permissions and limitations under the License.
 *
 */
'use strict';
exports.handler = function( event, context ) {
    var versionTxt = '3.1.2';
    var versionDate= '12/7/2016';
    var https = require( 'https' );
    // Paste app code here between the breaks------------------------------------------------
    var STappID = '8c44d313-74d0-4f85-b4a1-97487ea74e0b';
    var STtoken = '6ba53670-0e98-4855-87cb-0b154fa630f9';
    var url='https://graph.api.smartthings.com:443/api/smartapps/installations/' + STappID + '/' ;
    //---------------------------------------------------------------------------------------
        var cardName ="";
        var endSession = true;
        //var processedText;
        var stop;
        var areWeDone = false;
    //Get SmartThings parameters
        var beginURL = url + 'b?Ver=' + versionTxt + '&Date=' + versionDate + '&VerNum=' + versionNum + '&access_token=' + STtoken;
        https.get( beginURL, function( response ) {
        response.on( 'data', function( data ) {
            var startJSON = JSON.parse(data);
            var contOptions = startJSON.pContinue;
            var pName = startJSON.pMain;
            if (startJSON.error) { output("There was an error. If this continues to happen, please reach out for help", context, "Lambda Error", endSession, pName); }
            console.log(startJSON.error); 
            if (startJSON.error === "invalid_token" || startJSON.type === "AccessDenied") {
                output("There was an error accessing the SmartThings cloud environment. Please check your security token and application ID and try again. ", context, "Lambda Error", endSession, pName); 
            }
            else if (event.request.type == "IntentRequest") {
                var process = false;
                var intentName = event.request.intent.name;
                if (intentName === "main") {
                    var pCommand = event.request.intent.slots.pCommand.value;
                    var pProfile = event.request.intent.slots.pProfile.value;
                    var pNum = event.request.intent.slots.pNum.value;
                    var pDevice = event.request.intent.slots.pDevice.value;
                    url += 'c?pDevice=' + pDevice + '&pCommand=' + pCommand + '&pNum=' + pNum + '&pProfile=' + pProfile; 
                    process = true;
                    cardName = "EchoSistant Control";
                }
                else if (intentName != "main") {
                    var ttstext = event.request.intent.slots.ttstext.value;
                    var ttsintentname = event.request.intent.slots.ttstext.name.value;
                    url += 't?ttstext=' + ttstext + '&ttsintentname=' + ttsintentname + '&intentName=' + intentName;
                    process = true;
                    cardName = "EchoSistant Free Text";
                    
                    if (ttstext =="stop") {
                        areWeDone=true;
                        output(" Stopping. Goodbye ", context, "Amazon Stop", areWeDone);
                    } 
                    else if (ttstext=="no") {
                    areWeDone=true;
                    output(" It has been my pleasure.  Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="nope") {
                    areWeDone=true;
                    output(" It has been my pleasure.  Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="no thank you") {
                    areWeDone=true;
                    output(" It has been my pleasure.  Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="no we're done") {
                    areWeDone=true;
                    output(" It has been my pleasure.  Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="no we're good") {
                    areWeDone=true;
                    output(" It has been my pleasure.  Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="no I'm done") {
                    areWeDone=true;
                    output(" It has been my pleasure.  Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="no thanks") {
                    areWeDone=true;
                    output(" It has been my pleasure.  Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="cancel") {
                    areWeDone=true;
                    output(" Cancelling. Goodbye ", context, "Amazon Stop", areWeDone);
                    }
                    else if (ttstext=="yes") {
                            areWeDone=false;    
                        output("please continue...", context, process, areWeDone);
                    }
                    else if (ttstext=="okay") {
                            areWeDone=false;
                        output("please continue...", context, process, areWeDone);
                    }
                    else if (ttstext=="yeah") {
                            areWeDone=false;
                        output("please continue...", context, process, areWeDone);
                    }
                    else if (ttstext=="sure") {
                            areWeDone=false;
                        output("please continue...", context,process, areWeDone);
                    }
                    else if (ttstext === "repeat"+"last"+"message") {
                                    url += 't?ttstext=' + ttstext + '&intentName=' + intentName;
                                    process = true;
                                    areWeDone = false;
                    }
                }
                if (!process) {
                    areWeDone=true;
                    output("I am not sure what you are asking. Please try again", context, areWeDone); 
                }
                else {
                    url += '&access_token=' + STtoken;
                    https.get( url, function( response ) {
                    response.on( 'data', function( data ) {
                    var resJSON = JSON.parse(data);
                    var pContCmds = resJSON.pContCmds;
                    var speechText = resJSON.outputTxt;
                    console.log(speechText);
                    if (pContCmds === true) { 
                        areWeDone=false;
                        speechText = speechText + ', send another message?'; 
                    }
                    else {
                        areWeDone=true;
                    }
                    output(speechText, context, cardName, areWeDone);
                        } );
                    } );
                }
            }
        } );
    } );
};

function output( text, context, cardName,areWeDone) {
            var response = {
             outputSpeech: {
             type: "PlainText",
             text: text
                 },
                 card: {
                 type: "Simple",
                 title: "EchoSistant Smartapp",
                 content: text
                    },
                    shouldEndSession: areWeDone
                    };
                    context.succeed( { response: response } );
  }
