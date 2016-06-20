# Sapient Family Feud

This repository contains a basic web application that models the gameboard from Family Feud using HTML, CSS, and jQuery. It includes the interface of the gameboard, the basic gameplay functionality, and an optional websocket to connect buzzers. It was originally created for a SapientNitro Chicago office event where we surveyed employees on questions related to our office and culture. It is now available for reuse on your next event. 

## Basic Usage 

#### Basic Game Controls

* Display an Answer: Press the corresponding number key, #1-8 (To hide an answer simply press the corresponding number key again)
* Show Wrong Answer X: Press the Spacebar
* Go to next question: Mouse Click

Game control options are specified in the feud.js file and can be edited to best suit your purposes. 

#### Questions/Answer Data

In the js folder, all question and answer data is contained in an array in the `all_questions.js` file. Each question, answer and point value is an object in the array. Here is an example:
~~~~
// This is the file that contains all the question, question and point value data.

var json = [{
	// Example Object
	"question": "Question 1 goes here",
	"answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
	"points": [21, 17, 16, 16, 8, 8, 7, 7]
},{
	// Example Object
	"question": "Question 2 goes here",
	"answers": ["Answer 1", "Answer 2", "Answer 3", "Answer 4"],
	"points": [21, 17, 16, 16, 8, 8, 7, 7]
}
	//...Append additional questions here
];
~~~~
To update the survey data, all you need to do is replace the values after the "question", "answer" and "points" key. 

**NOTE: Each question object can take a maximum of 8 answer and point values. All additional answers will be ignored. It is acceptable to have less than 8 answer values. In this case, the blocks for empty answers will be hidden in the UI.**

#### UI and Styling

The default skin for the gameboard was designed in accordance with the Sapient Chicago Blend style guide. In the assets folder, you will see that the building blocks of the game board are just image assets. There are as follows:
* The Wrong answer X's
* The background image
* the question/answer block
* The sound effects for right/wrong answers. 

Feel free to use these images as a guide and replace them with your own assets. 

## Advanced Usage

#### Web Socket for Hardware Connection

This repo supports an optional websocket API that you can use to create "buzzers" for the game. The function submits a timestamp to your websocket endpoint that returns a button id value to the person who hits the buzzer first. Here is an example of the basic code structure: 

~~~~
// Websocket API to connect get which buzzer was pressed
function open_websocket() {
    var exampleSocket = new WebSocket(/*Insert websocket endpoint*/);

    exampleSocket.onopen = function(event) {
        console.log("opened websocket");
    };

    exampleSocket.onerror = function(error) {
        console.log("error", error);
    };
    exampleSocket.onmessage = function(error) {
      // event.data requires a "button_id" field
        var t_data = JSON.parse(event.data);
        console.log(t_data);

        if (t_data.hasOwnProperty("button_id")) {
            if (t_data["button_id"] == 1)
                displayBuzzerWinner(1);
            if (t_data["button_id"] == 2)
                displayBuzzerWinner(2);
        }
    };

    exampleSocket.onclose = function(event) {
        open_websocket();
    };
}
~~~~

You can use your own internal websocket or an open source option such as [socket.io](http://socket.io/ "Websocket"). At Sapient, we used Channels, an IoT platform developed by Sapient's IoT Lab. If you are interested in using Channels, feel free to contact us. 

This structure allows you to be creative and construct "hardware" for truly interactive gameplay. For our purposes, we soldered the chips from a basic mouse onto a red button we purchased from [Sparkfun](https://www.sparkfun.com/ "Sparkfun"). We then put this button into a container and labeled them. Every time the red button was pressed it triggered a mouse click event that sent data to the websocket. Feel free to get creative and do this whatever way you want. Here is an example of ours

![Buzzers for Family Feud](https://s31.postimg.org/xx8fetn8r/IMG_9577_1.jpg "Buzzers")


