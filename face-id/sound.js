var player = require('play-sound')(opts = {})

var soundMap = {
  andy: 'rain.mp3',
  dave: 'piano.mp3'
}

var playSound = function (name) {
  var file = soundMap[name];
  var audio = player.play('./assets/' + file, function(err){
    if (err) throw err
  });
  
  return audio;
}

exports.playSound = playSound;