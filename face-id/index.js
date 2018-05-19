const path = require('path')
const fs = require('fs')
const fr = require('face-recognition')
const find = require('find-process');
const glob = require("glob")

const dataPath = path.resolve('./data/faces')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const exec = require('child_process').exec;

var facialRec = require('./asyncFaceRecognition.js');
console.log(facialRec.SimpleMessage);

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

const name = 'dave';
sound.playSound(name);


var peopleSeen = [];
var currentPerson = undefined;
function checkImageHistory() {
  if(peopleSeen.length < 2) {
    return;
  }

  if (peopleSeen.last() === peopleSeen[peopleSeen.length - 2])
    currentPerson = peopleSeen.last();
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

var processNewImage = function() {

  // options is optional
  var options = undefined;
  glob("./*.jpg", options, function (er, files) {
    if(files.length === 0) {
      return;
    }
    
    var file = files[0];
    console.log(file);
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

}

function startImagesnap() {
  find('name', 'imagesnap')
    .then(function (list) {
      console.log('there are %s imagesnap process(es)', list.length);
      if(list.length === 0) {
        console.log("Now executing the following shell command: ");
        console.log("imagesnap -t 5");
        exec('imagesnap -t 5');
      }
  });
}

setInterval(mainLoop, 1000);
