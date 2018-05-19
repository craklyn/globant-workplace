const path = require('path')
const fs = require('fs')
const fr = require('face-recognition')
const find = require('find-process');

const dataPath = path.resolve('./data/faces')
const classNames = ['sheldon', 'lennard', 'raj', 'howard', 'stuart']

const exec = require('child_process').exec;


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
var currentPerson = Undefined;
var checkImageHistory() {
  if(peopleSeen.length < 2) {
    return;
  }

  if (peopleSeen.last() === peopleSeen[peopleSeen.length - 2])
    currentPerson = peopleSeen.last();
}

function mainLoop() {
  // Takes image with webcam
  startImagesnap();
  // Uses image to guess identity
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

setInterval(mainLoop, 3000);
