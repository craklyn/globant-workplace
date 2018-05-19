const player = require('play-sound')(opts = {});
const say = require('say');

const soundMap = {
  andy: 'rain.mp3',
  dave: 'piano.mp3'
}

const playSound = function (name) {
  const file = soundMap[name];
  const audio = player.play('./assets/' + file, function(err){
    if (err) throw err
  });

  return audio;
}

const speak = function (words) {
  say.speak(words);
}

exports.playSound = playSound;
exports.speak = speak;