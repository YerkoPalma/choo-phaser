window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')
var GameFactory = require('../lib/factory')

module.exports = function (state, emit) {
  state.tts.selectedVoice = state.tts.voices.filter(voice => {
    return voice.lang === 'en-GB'
  })[0]
  var game = GameFactory(require('./numbers.json'), state, emit)

  game.start()
  // bypass nanorouter assertion returning an empty main
  return document.createElement('main')
}
