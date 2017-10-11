window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

module.exports = function (state, emit) {
  state.game = new window.Phaser.Game('100', '100', window.Phaser.AUTO)

  var gameState = {
    preload: function () {
      state.game.load.image('background', '../../background.jpg')
    },
    create: function () {
      state.game.add.tileSprite(0, 0, window.outerWidth, window.outerHeight, 'background')
    },
    update: function () {

    }
  }

  state.game.state.add('initialState', gameState)
  state.game.state.start('initialState')
  // bypass nanorouter assertion returning an empty div
  return document.createElement('main')
}
