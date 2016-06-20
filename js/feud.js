var currQuestion = 0;
var numWrong = 0;

var shouldListenForBuzzer = true;
var isTeamDisplayed = true;

var xAudio;
var buzzerAudio;
var correctAudio;


$(document).ready(function() {
    console.log(json);
    open_websocket();
    populateQuestion(currQuestion);
    initAudio();

    $(".xContainer").hide();
    $("body").click(function(){
        nextQuestion();
    });

    $("body").bind('keypress', function(e) {
        // spacebar = wrong answer
        console.log(e.keyCode);
        if(e.keyCode == 32) {
            numWrong = (numWrong + 1)%4;
            if(numWrong == 0) numWrong = 1;
            xAudio.play();
            $(".xContainer").find("img").attr("src", "assets/" + numWrong + "x.png");
            $(".xContainer").show(0).delay(1200).hide(0);
        }

        // 1-8 = reveal answer
        if(e.keyCode >=49) {
            var keyNum = e.keyCode - 48;
            if(keyNum <= json[currQuestion].answers.length)
                showAnswer(keyNum);
        }

        // enter key = show answer again
        if(e.keyCode == 13 && isTeamDisplayed) {
             $(".questionText").html(json[currQuestion].question.toUpperCase());
             isTeamDisplayed = false;
            shouldListenForBuzzer = true;
        }
    });

});

function initAudio() {
    xAudio = document.createElement('audio');
    xAudio.setAttribute('src', 'assets/x.mp3');

    buzzerAudio = document.createElement('audio');
    buzzerAudio.setAttribute('src', 'assets/buzzer.mp3');

    correctAudio = document.createElement('audio');
    correctAudio.setAttribute('src', 'assets/correct.mp3');
}

function showAnswer(answerNum) {
        $("#answer" + answerNum).find("p").toggle();
        $("#answer" + answerNum).find("div").toggle();
        $("#points" + answerNum).find("p").toggle();
        correctAudio.play();
}

function populateQuestion(questionNum) {
    if(questionNum >= json.length) {
        alert("no more questions - returning to question 0");
        questionNum = 0;
        currQuestion=0;
    }
    var numQuestions = json[questionNum].answers.length;
    $(".questionText").html(json[questionNum].question.toUpperCase());
    for(var i=1; i<=numQuestions; i++) {
        $("#answer" + i).find("p").html(json[questionNum].answers[i-1].toUpperCase());
        $("#points" + i).find("p").html(json[questionNum].points[i-1]);
    }

    // hide answer boxes that have no text
    if(numQuestions < 8) {
        for(var i=numQuestions+1; i<=8; i++)
            makeAnswerTransparent(i);
    }
 }

function makeAnswerTransparent(answerNum) {
    $("#answer" + answerNum).css("background-color", "transparent");
    $("#answer" + answerNum).css("border-color", "transparent");
    $("#answer" + answerNum).find("div").hide();
    $("#points" + answerNum).css("background-color", "transparent");
    $("#points" + answerNum).css("border-color", "transparent");
}

function resetAnswerVisibility() {
    for(var i=1; i<=8; i++) {
        $("#answer" + i).css("background-color", "#df6851");
        $("#answer" + i).css("border-color", "#f2c317");
        $("#answer" + i).find("div").show();
        $("#points" + i).css("background-color", "#df6851");
        $("#points" + i).css("border-color", "#f2c317");
    }
}

function nextQuestion() {
    currQuestion = currQuestion + 1;
    numWrong = 0;
    resetAnswerVisibility();
    $(".revealText").hide();
    $(".answerNum").show();
    populateQuestion(currQuestion);
}


function displayBuzzerWinner(winner) {
  // displays winner of the buzzer battle
    var timeoutSeconds = 10;
    if(shouldListenForBuzzer) {
        shouldListenForBuzzer = false;
        buzzerAudio.play();
        $(".questionText").html("TEAM " + winner + ": YOUR TURN!");
        isTeamDisplayed = true;
    }
}

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
