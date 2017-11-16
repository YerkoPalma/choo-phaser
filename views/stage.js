window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')
var GameFactory = require('../lib/factory')

module.exports = function (state, emit) {
  state.tts.selectedVoice = state.tts.voices.filter(voice => {
    return voice.lang === 'en-GB'
  })[0]
  var gameOptions
  if (state.params.id === 'actions') {
    gameOptions = require('./actions.json')
  } else if (state.params.id === 'alphabet') {
    gameOptions = require('./alphabet.json')
  } else if (state.params.id === 'animals') {
    gameOptions = require('./animals.json')
  } else if (state.params.id === 'classroom') {
    gameOptions = require('./classroom.json')
  } else if (state.params.id === 'food') {
    gameOptions = require('./food.json')
  } else if (state.params.id === 'my-things') {
    gameOptions = require('./my-things.json')
  } else if (state.params.id === 'numbers') {
    gameOptions = require('./numbers.json')
  } else if (state.params.id === 'profesions') {
    gameOptions = require('./profesions.json')
  } else if (state.params.id === 'qualify') {
    gameOptions = require('./qualify.json')
  }
  var game = GameFactory(gameOptions, state, emit)

  game.start()
  // bypass nanorouter assertion returning an empty main
  return document.createElement('main')
}
