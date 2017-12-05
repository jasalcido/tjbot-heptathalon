/*
User-specific configuration
    ** IMPORTANT NOTE ********************
    * Please ensure you do not interchange your username and password.
    * Hint: Your username is the lengthy value ~ 36 digits including a hyphen
    * Hint: Your password is the smaller value ~ 12 characters
*/ 

exports.conversationWorkspaceId = '51151374-a0fe-4d96-9dc5-9dcb9a1bfdc5'; // replace with the workspace identifier of your conversation

// Create the credentials object for export
exports.credentials = {};

// Watson Conversation
// https://www.ibm.com/watson/developercloud/conversation.html
exports.credentials.conversation = {
	password: 'KCMgm6omjtHJ',
	username: 'd6e23f30-4dc2-4bf3-83b7-404474057a81'
};

// Watson Speech to Text
// https://www.ibm.com/watson/developercloud/speech-to-text.html
exports.credentials.speech_to_text = {
	password: 'sdVzn1F0PS0I',
	username: '1594993d-02f0-45a2-af0a-284fe77cb0d5'
};

// Watson Text to Speech
// https://www.ibm.com/watson/developercloud/text-to-speech.html
exports.credentials.text_to_speech = {
	password: 'a0ze06EeszyF',
	username: 'f55a7c2d-78a5-472f-a874-10870c84465d'
};
// Watson Tone Analyzer
// https://www.ibm.com/watson/developercloud/tone-analyzer.html
exports.credentials.tone_analyzer = {
    password: '1KXSSG2jLsCB',
    username: 'c68a6f33-644b-456e-ae32-7ef5cd088a08'
};
// Watson Language Translator
// https://www.ibm.com/watson/developercloud/language_translator.html
exports.credentials.language_translator = {
    password: 'ieJvNnt84fLF',
    username: '56dcf245-f466-47a3-a117-9631126df0d1'
};
// Watson Visual Recognition
// https://www.ibm.com/watson/developercloud/visual recognition.html
exports.credentials.visual_recognition = {
    "api_key": "3f60048ad8bc373a42e6d05767e4310250aee3a7"
};
