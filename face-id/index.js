const path = require('path')
const fs = require('fs')
const fr = require('face-recognition')
const find = require('find-process');
const glob = require("glob");
const glob_promise = require("glob-promise");
//const glob = require("glob-promise");
const detector = fr.FaceDetector();

const dataPath = path.resolve('./data/faces')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const exec = require('child_process').exec;

const recognizer = fr.FaceRecognizer();
const win = new fr.ImageWindow()
const predictor = fr.FaceLandmark68Predictor()

//var facialRec = require('./asyncFaceRecognition.js');
//console.log(facialRec.SimpleMessage);

/*
const allFiles = fs.readdirSync(dataPath)
const imagesByClass = classNames.map(c =>
  allFiles
    .filter(f => f.includes(c))
    .map(f => path.join(dataPath, f))
    .map(fp => fr.loadImage(fp))
)

const numTrainingFaces = 10
const trainDataByClass = imagesByClass.map(imgs => imgs.slice(0, numTrainingFaces))
const testDataByClass = imagesByClass.map(imgs => imgs.slice(numTrainingFaces))
*/

const sound = require('./sound');
const light = require('./light');


var peopleSeen = [];
var currentPerson = undefined;
var previousPerson = undefined;

function checkImageHistory() {
  console.log(peopleSeen);

  console.log("Debug c");

  if(peopleSeen.length < 2) {
    console.log("Debug b");
    return;
  }

  if (peopleSeen[peopleSeen.length-1] == peopleSeen[peopleSeen.length - 2]) {
    previousPerson = currentPerson;
    currentPerson = peopleSeen[peopleSeen.length-1];
    console.log("Debug a");
  }
  console.log("Debug d");
}


//moves the $file to $dir2
var moveFile = (file, dir2)=>{
  //include the fs, path modules
  var fs = require('fs');
  var path = require('path');

  //gets file name and adds it to dir2
  var f = path.basename(file);
  var dest = path.resolve(dir2, f);

  fs.rename(file, dest, (err)=>{
    if(err) throw err;
    else console.log('Successfully moved');
  });
};

var init = function() {
  const names = ['daniel', 'catherine', 'andy', 'carli'];

  if (fs.existsSync("./model.json")) {
    console.log("Loading model");
    const modelState = require('./model.json')
    recognizer.load(modelState)
  }
  else {
    var promises = [];

    for(var i = 0; i < names.length; i++) {
      var name = names[i];
      console.log("Now training for person " + name);

      var files = glob_promise.sync("./data/faces/" + name + "*.png");

      var name_copy = name;
      var images = [];
      for(j = 0; j < files.length; j++) {
        var file = files[j];

        console.log(file);
        const image = fr.loadImage(file);
        images.push(image);
      }

      var numJitters = 1;
      console.log(images.length);
      console.log(name_copy);
      recognizer.addFaces(images, name_copy, numJitters);
    };

    console.log("saving model");
    const modelState = recognizer.serialize();
    fs.writeFileSync('model.json', JSON.stringify(modelState));
  }

  console.log("Opening imagesnap");
  startImagesnap();
}

var processNewImage = function() {

  // options is optional
  var options = undefined;
  glob("./*.jpg", options, function (er, files) {
    if(files.length === 0) {
      return;
    }
    
    var file = files[0];
    console.log(file);

    const image = fr.loadImage(file);
    const faceImages = detector.detectFaces(image);
//    if(faceImages.length === 1) {
      const bestPrediction = recognizer.predictBest(faceImages[0]);
      console.log("Best face prediction: ");
      console.log(bestPrediction);
      peopleSeen.push(bestPrediction.className);

      // Debug 1
      win.setImage(image)
//      const faceRectangles = detector.locateFaces(image);
//      const shapes = faceRectangles.map(rect => predictor.predict(image, rect));
      const temp_detector = new fr.FrontalFaceDetector()
      const faceRects = temp_detector.detect(image);
      const shapes = faceRects.map(rect => predictor.predict(image, rect));
      win.renderFaceDetections(shapes);
//    }

    //move file1.htm from 'test/' to 'test/dir_1/'
    moveFile(file, './snapshots/');

  });
}

function mainLoop() {
  // Takes image with webcam
  startImagesnap();

  // Uses image to guess identity
  processNewImage();

  // Logic to confirm identity (e.g. 2 identifications sequentially)
  checkImageHistory();

  // Respond to identity with playing sound
  // Respond to identity with light
  console.log("Current person: " + currentPerson);
  if(currentPerson && currentPerson != previousPerson) {
    sound.playSound(currentPerson);
    light.changeColor(currentPerson);
  }

}

function startImagesnap() {
  find('name', 'imagesnap')
    .then(function (list) {
      console.log('there are %s imagesnap process(es)', list.length);
      if(list.length === 0) {
        console.log("Now executing the following shell command: ");
        console.log("imagesnap -t 5 -w 2");
        exec('imagesnap -t 5 -w 2');
      }
  });
}

init();
setInterval(mainLoop, 1000);
