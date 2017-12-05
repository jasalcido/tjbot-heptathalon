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

In addition to the Watson Conversation, Speech to Text, and Text to Speech services, this recipe also leveraged code from the [Make Your Robot Respond to Emotions Using Watson](https://github.com/ibmtjbot/tjbot/tree/master/recipes/sentiment_analysis) recipe for Tone Analysis logic, the [Use Your Voice to Control a Light with Watson](https://github.com/ibmtjbot/tjbot/tree/master/recipes/speech_to_text) recipe for LED logic (I prefer pulse to shine, beware of deprecation), and the [TJVision by Victor Dibia](https://github.com/victordibia/tjvision) featured recipe for visual recognition logic.  You will find in the recipes above all the necessary instructions to set up your Watson Services on the IBM Cloud, so I won't repeat them here.
