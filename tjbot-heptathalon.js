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

// ** additions by Ron Mauer, IBM

// ** some key variables
var begin_transform = '';
var end_transform = '';
var pulse_duration = 1.0;
var tone_score_threshhold = .65;
var spoken_result = '';
var intent_confidence_threshhold = .425;  // ** for some reason issue with false positives with sadness and joke intent

// ** this section for Provider Search
var https = require('https');
var rest_url_start = 'https://www.highmarkblueshield.com/rbsmbl/x-services/public/provider/v1/search/summary?brandName=Highmark+Blue+Cross+and+Blue+Shield&lat=40.44062479999999&lng=-79.99588640000002&query=';
var rest_url_end = '&radius=20&start=0&view=list';
var startpos = 0;
var endpos = 0;
var displayName = '';
var performedQuery = '';
var xmlstr = '';
var restpath = '';

// ** this section for Watson Discovery service
var DiscoveryV1 = require('watson-developer-cloud/discovery/v1');
var tjbot_environment = '219b3a0d-5b5b-4a43-890a-4bd0628cfc4a';  // *** from my Watson Discovery News Collection
var tjbot_collection = '8ee2cbea-06a8-4a84-a85e-8cdcc17802c3';  // *** from my Watson Discovery News Collection
var tjbot_configuration = 'f9bb44c4-4174-4ea3-9b3f-923824223db3';  // *** from my Watson Discovery News Collection
var discovery = new DiscoveryV1({
  username: "4e71ccf3-96b4-40a4-8ed6-8b4550d25afd",  // *** from my Watson Discovery service
  password: "zCjsYl1tNkzc",  // *** from my Watson Discovery service
  version: 'v1',
  // version_date: '2017_04_27' // *** the version that is currently in /home/pi/tjbot/bootstrap/tests/node_modules/watson-developer-cloud/discovery
  version_date: '2016-12-01' // *** the version referenced by default in Watson API Explorer
  // version_date: '2017-07-19' // *** the version referenced in API doc
});
var news_query = '';
var short_title = '';
console.log(discovery); // ** make sure Discovery initiation worked

// ** this section for tjbot
var TJBot = require('tjbot');
var config = require('./config');
var credentials = config.credentials;  // ** obtain our credentials from config.js
var WORKSPACEID = config.conversationWorkspaceId;  // ** get workspace for Conversation
var hardware = ['microphone', 'speaker', 'led', 'servo', 'camera']; // ** these are the hardware capabilities for this TJBot
var tjConfig = {  // ** set up TJBot's configuration, especially those values changed from default
    log: {
        level: 'verbose' // ** sample levels are 'error', 'warn', 'info', 'verbose', 'debug', 'silly'
    },
    robot: {
        gender: 'female', // ** sample entries are 'male', 'female'
        name: 'Lisa' // ** also used as catchword
    },
    listen: {
        microphoneDeviceId: "plughw:1,0", // ** plugged-in USB card 1, device 0; see arecord -l for a list of recording devices
        inactivityTimeout: -1, // ** -1 to never timeout or break the connection. Set this to a value in seconds e.g 120 to end connection after 120 seconds of silence
        language: 'en-US' // ** sample entries are 'ar-AR', 'en-UK', 'en-US', 'es-ES', 'fr-FR', 'ja-JP', 'pt-BR', 'zh-CN'
    },
    speak: {
        language: 'en-US', // ** sample entries are 'en-GB', 'en-US', 'es-US', 'ja-JP', 'pt-BR'
        voice: 'en-US_AllisonVoice', // ** some examples are 'en-US_LisaVoice', 'en-US_AllisonVoice', 'en-US_MichaelVoice'
        speakerDeviceId: "plughw:1,0" // ** plugged-in USB card 1, device 0; see aplay -l for a list of playback devices
    }
};

// **
// ** instantiate our TJBot and start listening!!
// **
var tj = new TJBot(hardware, tjConfig, credentials);
console.log("I am listening for the catchword, which is my name - " + tj.configuration.robot.name);
tj.listen(function(msg) {  // ** listen for utterances with our attentionWord and send the result to the Conversation service
    if (msg.startsWith(tj.configuration.robot.name)) {      // ** check to see if they are talking to TJBot
        tj.pulse('green', pulse_duration);  //** shine the LED green to acknowledge
        var turn = msg.toLowerCase().replace(tj.configuration.robot.name.toLowerCase(), "");         // ** remove catchword from message
        tj.analyzeTone(turn).then(function(tone) {         // ** check the message for tone
			console.log(JSON.stringify(tone, null, 2));  // ** log the Tone response object to console
            tone.document_tone.tone_categories.forEach(function(category) {
                if (category.category_id == "emotion_tone") {
                    var max = category.tones.reduce(function(a, b) {  // ** find the emotion with the highest confidence
                        return (a.score > b.score) ? a : b;
                    });
                    if (max.score > tone_score_threshhold) {  // ** pulse LED based on threshhold, tone_id
						if (max.tone_id == "anger") {
							tj.pulse('red', pulse_duration);
						}
						if (max.tone_id == "fear") {
							tj.pulse('orange', pulse_duration);
						}
						if (max.tone_id == "disgust") {
							tj.pulse('purple', pulse_duration);
						}
						if (max.tone_id == "joy") {
							tj.pulse('white', pulse_duration);
						}
						if (max.tone_id == "sadness") {
							tj.pulse('blue', pulse_duration);
						}
					}
                }
            });
        }); // ** end Analyze Tone
       
        tj.converse(WORKSPACEID, turn, function(response) {          // ** send the message to the conversation service
            console.log(JSON.stringify(response, null, 2));  // ** log response object to console
            if (response.object.intents.length > 0 && response.object.intents[0].confidence > intent_confidence_threshhold) {              // ** check for intents with further action before going on
				 tj.speak(response.description);  // ** speak response description from Conversation

				 // ** Watson Discovery if intent is News
                 if(response.object.intents[0].intent == "News") {
                    news_query = turn + ",language:english";
                    discovery.query({
	                    environment_id: tjbot_environment,
	                    collection_id: tjbot_collection,
	                    "natural_language_query": news_query,
	                    "count": 1,
	                    "filter": "docSentiment.type:positive",
	                    "return": "alchemyapi_text,title,text,enrichedTitle.text,url,host,docSentiment"
                    },
                    function(error, data) {
	                    console.log(JSON.stringify(data, null, 2));
	                    spoken_result = "From " + data.results[0].host + ", " + data.results[0].title;
	                    tj.speak(spoken_result);
                    });
                 }  // ** end News Intent

                 // ** wave if intent is Goodbye
                 if(response.object.intents[0].intent == "Goodbye") {
                    tj.wave();
                 }  // ** end Goodbye Intent

                 // ** show arm movements if intent is move_arm
                 if(response.object.intents[0].intent == "move_arm") {
	                 tj.speak("I can move my arm many ways to facilitate communication").then(function() {
						return tj.speak("I can lower my arm");
	                 }).then(function() {
						tj.lowerArm();
						return tj.speak("I can raise my arm");
	                 }).then(function() {
						tj.raiseArm();
						return tj.speak("I can pull my arm back");
	                 }).then(function() {
						tj.armBack();
						return tj.speak("or I can wave");
	                 }).then(function() {
						return tj.wave();
	                 });
                 }  // ** end move_arm Intent
                 
				 // ** translate if intent is Languages
                 if (response.object.intents[0].intent == "Languages") {
					tj.translate("I can also speak French and other languages", 'en', 'fr').then(function(translation) {
						console.log(JSON.stringify(translation, null, 2));
						tj.speak(translation.translations[0].translation);
					});
				 }  // ** end Languages Intent

				 // ** Visual Recognition if intent is see
                 if (response.object.intents[0].intent == "see") {
					 tj.see().then(function(objects) {
						console.log(JSON.stringify(objects, null, 2));
						spoken_result = "I think I see " + objects[0].class + ", or " + objects[1].class;
						tj.speak(spoken_result);
					});
				  }  // ** end see Intent
				 
                 // ** Provider Search if intent is Doctors
				 if (response.object.intents[0].intent == "Doctors") {
					// ** HMHS Provider Search rest api call, use utterance as search term
					// ** could use Not Found test
					restpath = rest_url_start + turn + rest_url_end;
					xmlstr = '';
					callback = function(response) {
						response.on('data', function(chunk) {  						// ** chunk of data received, append it
							xmlstr += chunk;
						});
						response.on('end', function() {  // ** response has been received
							console.log(xmlstr);
							startpos = xmlstr.search('displayName') + 14;
							endpos = xmlstr.search('gender') -3;
							displayName = xmlstr.slice(startpos, endpos);  							// ** find displayName
							console.log(startpos, endpos, displayName);
//							startpos = xmlstr.search('performedQuery') + 17;
//							endpos = xmlstr.search('recommendedQuery') -3;
//							performedQuery = xmlstr.slice(startpos, endpos);  							// ** find performedQuery
//							console.log (startpos, endpos, performedQuery);
							if (endpos > startpos) {
								spokenresult = 'For your query ' + turn + ' I have found ' + displayName;
							} else {
								spokenresult = 'Sorry, I could not answer your request ' + turn;
							}
							tj.speak(spokenresult);  //** speak result
						});
					}
					https.request(restpath, callback).end();
				 }  // ** end Doctors Intent
				 
				 // ** Placeholder for Research Intent (Medline)
                 if (response.object.intents[0].intent == "Research") {
					 console.log("*** Research Coming Soon!! ***");
					 tj.speak('The Research intent is currently under construction');
				 }  // ** end Research Intent

				 // ** Voice tranformation Intent
                 if (response.object.intents[0].intent == "Transform") {
					 tj.speak('I can transform my voice in many ways').then(function() {
						return tj.speak('I am sorry');
						}).then(function() {
						begin_transform = '<express-as type="Apology">';
						end_transform = '</express-as>';
						spoken_result = begin_transform + 'I am sorry' + end_transform;		
						return tj.speak(spoken_result);
					 }).then(function() {
						return tj.speak('This is a more youthful voice');
						}).then(function() {
						begin_transform = '<voice-transformation type="Young" strength="80%">';
						end_transform = '</voice-transformation>';
						spoken_result = begin_transform + 'This is a more youthful voice' + end_transform;		
						return tj.speak(spoken_result);
					 }).then(function() {
						return tj.speak('That is very exciting.  I am happy for you');
						}).then(function() {
						begin_transform = '<express-as type="GoodNews">';
						end_transform = '</express-as>';
						spoken_result = begin_transform + 'That is very exciting.  I am happy for you.' + end_transform;		
						return tj.speak(spoken_result);		
					 });
				 }  // ** end Transform Intent

		     }  else {
					begin_transform = '<express-as type="Apology">';
					end_transform = '</express-as>';
					spoken_result = begin_transform + 'Sorry, I did not recognize your intent.' + end_transform;		
					tj.speak(spoken_result);
			 }  // ** End Intent Check
        });  // ** End Converse
    }  // ** End Catchword Heard
});  // ** End tj.listen
