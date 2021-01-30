var isMobileDevice = false;
var gamePattern = [];
var userSequence = [];
var buttonColors = ["red", "blue", "green", "yellow"];
var isGameStarted = false;
var wrongAnswer = false;
var level = 1;

handleMobileVersion();
game();

function game() {
    //starting game
    if (isMobileDevice) {
        mobileGameStart();
    } else {
        computerGameStart();
    }

    // user try to reproduce the game sequence
    handleUserClick();
}

function handleMobileVersion() {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
            navigator.userAgent
        )
    ) {
        console.log("mobile device detected");
        isMobileDevice = true;
    }

    if (isMobileDevice) {
        $("#level-title").html("Tap the screen to start");
    }
}

// game start when "a" is pressed
function computerGameStart() {
    $(document).keypress(function (e) {
        if (!isGameStarted && e.key == "a") {
            console.log("game started");
            isGameStarted = true;
            changeHeader();

            // game show the sequence to do
            setTimeout(function () {
                GameSequence();
            }, 1000);
        }
    });
}

function mobileGameStart() {
    $("body").click(() => {
        if (!isGameStarted) {
            console.log("game started");
            isGameStarted = true;
            changeHeader();

            // game show the sequence to do
            setTimeout(function () {
                GameSequence();
            }, 1000);
        }
    });
}

function loadNewLevel() {
    console.log("Loading new level");
    level += 1;
    changeHeader();

    // game show the sequence to do
    setTimeout(function () {
        GameSequence();
    }, 1000);
}

function ReloadGame() {
    $(".tryAgainButton").click(function () {
        location.reload();
    });
}

function GameSequence() {
    userSequence = [];
    NextRandomColor();
    PlayButton(gamePattern[gamePattern.length - 1]);
}

function handleUserClick() {
    $(".btn").click(function (e) {
        if (isGameStarted) {
            userSequence.push(e.target.id);
            // console.log(userSequence);
            // console.log(gamePattern);
            PlayButton(e.target.id);
            checkUserInput();
        }
    });
}

function checkUserInput() {
    for (var i = 0; i < userSequence.length; i++) {
        if (userSequence[i] === gamePattern[i]) {
            console.log("correct");
        } else if (userSequence[i] !== gamePattern[i]) {
            console.log("wrong");
            PlaySound("./sounds/wrong.mp3");
            wrongAnswer = true;
            $("body").addClass("game-over");
            setTimeout(function () {
                $("body").removeClass("game-over");
            }, 200);
            $(".container").html(
                "<h1 id='level-title' class='game-over-text'>GAME OVER</h1>" +
                    "<button class='tryAgainButton'>try again</button>"
            );
            ReloadGame();
            return;
        }
    }
    if (userSequence.length === gamePattern.length) {
        loadNewLevel();
    }
}

// core functions

function changeHeader() {
    if (isGameStarted) {
        $("h1").text("LEVEL: " + level);
    }
}

function NextRandomColor() {
    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColor = buttonColors[randomNumber];
    gamePattern.push(randomChosenColor);
}

function PlayButton(colorButton) {
    if (!wrongAnswer) {
        PlaySound("./sounds/" + colorButton + ".mp3");
        var buttonSelected = "#" + colorButton;

        var timeDelay = 100;
        // buttons animation
        $(buttonSelected).fadeOut(timeDelay);
        $(buttonSelected).fadeIn(timeDelay);
        $(buttonSelected).addClass("pressed");
        setTimeout(function () {
            $(buttonSelected).removeClass("pressed");
        }, timeDelay);
    }
}

function PlaySound(music) {
    var soundLocation = new Audio(music);
    soundLocation.play();
}
