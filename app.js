const modelParams = {
    flipHorizontal: true, // flip e.g for video 
    imageScaleFactor: 0.7, // reduce input image size for gains in speed.
    maxNumBoxes: 70, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.79, // confidence threshold for predictions.
}

navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
let model;
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

handTrack.startVideo(video)
    .then(status => {
        if (status) {
            navigator.getUserMedia({ video: {} }, videoStream => {
                    video.srcObject = videoStream;
                    setInterval(detectHands, 300);
                },
                error => console.log(error));
        }
    });

handTrack.load(modelParams)
    .then(loadedModel => {
        model = loadedModel;
    });

function detectHands() {
    model.detect(video)
        .then(predictions => {
            if (predictions.length !== 0) {
                let hands = predictions[0].bbox;
                hand_x = hands[0];
                hand_y = hands[1];
                console.log(hands);
                // console.log("X : " + hand_x + "\nY : " + hand_y);

                if (hand_y > 300) {
                    if (hand_x < 100) {
                        audio.src = 'sounds/e-chord.mp3';
                    } else if (hand_x > 130 && hand_x < 280) {
                        audio.src = 'sounds/c-chord.mp3';
                    } else if (hand_x > 280 && hand_x < 400) {
                        audio.src = 'sounds/b-chord.mp3';
                    } else if (hand_x > 400) {
                        audio.src = 'sounds/a-chord.mp3';
                    }
                }
                if (hand_x > 400 && hand_y < 75) {
                    audio.src = 'sounds/drum-snare.mp3';
                }
                audio.play();
            }
        });
}