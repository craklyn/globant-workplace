const player = require('play-sound')(opts = {});
const say = require('say');

const soundMap = {
  andy: 'rain.mp3',
  daniel: 'piano.mp3'
}

var audio = null;

const playSound = function (name) {
  if (audio) {
    audio.kill();
  }

  speak('Welcome back ' + name);

  const file = soundMap[name];
  audio = player.play('./assets/' + file, function(err){
    if (err) throw err
  });
}

const speak = function (words) {
  say.speak(words);
}

exports.playSound = playSound;
exports.speak = speak;