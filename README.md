# tjbot-heptathalon
Exercise tjbotlib and hardware to do 7 things:
1) Use tj.converse() and tj.speak() to engage in a conversation and recognize intents;
2) Show empathy via voice transformations for the Allison voice and tj.speak();
3) Detect emotions and provide feedback via LED using tj.analyzeTone() and tj.pulse();
4) Translate and speak a simple phrase using tj.translate();
5) Communicate with motion using tj.wave() and other arm movements;
6) Visually recognize objects in a photo using tj.see();
7) Read News headlines using Watson Discovery;

Leverages IBM [Watson Cognitive Services](https://www.ibm.com/watson/developercloud/doc/index.html) including - Conversation, Text to Speech, Speech to Text, Language Translator, Discovery, Tone Analyzer and Visual Recognition.

See the video [here](https://youtu.be/bLqGqhc3cRA)

# Hardware
This recipe requires a tjbot with a LED, microphone, speaker, camera and servo

# Notice
I am a total newb, and have likely violated every Coding, Git and Node convention.  But please don't throw any shame or my bot's LED might pulse blue!

# Build and Run
The best place to start is the TJBot project on Git [here](https://github.com/ibmtjbot/tjbot).  You will find excellent background on the TJBot project, how to get parts for your TJBot, instructions for assembly, and bringing your TJBot to Life.

Since you are here, you have likely already worked with the three initial recipes, but if not, I recommend starting with the [Build a Talking Robot with Watson](https://github.com/ibmtjbot/tjbot/tree/master/recipes/conversation) recipe, as that recipe served as the initial foundation for this TJBot heptathalon recipe.

In addition to the Watson Conversation, Speech to Text, and Text to Speech services, this recipe also leveraged code from the [Make Your Robot Respond to Emotions Using Watson](https://github.com/ibmtjbot/tjbot/tree/master/recipes/sentiment_analysis) recipe for Tone Analysis logic, the [Use Your Voice to Control a Light with Watson](https://github.com/ibmtjbot/tjbot/tree/master/recipes/speech_to_text) recipe for LED logic (I prefer pulse to shine, beware of deprecation), and the [TJVision by Victor Dibia](https://github.com/victordibia/tjvision) featured recipe for visual recognition logic.

Here are the essential steps:
 1) Create instances of the following Watson Cognitive Services on the IBM Cloud:
    -- Conversation
    -- Speech to Text
    -- Text to Speech
    -- Tone Analyzer
    -- Visual Recognition
    -- Language Translator
 2) Import the tjbot-heptathalon-workspace.json into the Conversation Service
 3) Edit the config.js file with the credentials for each service.  Pay particular attention to the differences with the Conversation Service (also need the workspace id) and the Visual Recognition Service (api_key instead of username/password set)
 4) Create an instance of the Watson Discovery Service on the IBM Cloud
 5) Edit the tjbot-heptathalon.js code with the credentials for the Watson Discovery service.  Hints in the code comments where to look.
 6) Copy the tjbot-heptathalon.js and config.js files into the Watson recipe directory of your choice.  My strong recommendation is under the directory for the Conversation recipe.
 
 You should now be ready to go!!  Use the TJBot Heptathalon Script 1Dec2017.docx for some ideas on how to setup and execute this recipe.  Use the TJBot Visual Recognition Flash Cards.docx to print out some flashcards for use with the Visual Recognition Service.
 
 # Helpful Hints
 
 I cannot overemphasize how much simpler things were for me after adding a USB Sound Card with attached microphone and speaker.
 
 It was helpful to test the camera, speaker and mic before constructing the TJBot and bringing it to life.  Use the testcamera.py python script and the embedded Raspberry Pi Python capabilities for the camera.  For the microphone and speaker, the following commands were helpful:
 $ arecord ??? need to update
 $ aplay ??? need to update

My first catchword was TJ, which caused two problems:  Too many times TJBot heard DJ or Teacher.  And the J sound is problematic for non-native English speakers.
