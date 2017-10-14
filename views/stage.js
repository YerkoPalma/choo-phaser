window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

module.exports = function (state, emit) {
  state.game = new window.Phaser.Game('100', '100', window.Phaser.AUTO)

  var gameState = {
    preload: function () {
      state.game.load.image('background', '../../background.png')
      state.game.load.atlas('girl', '../../spritesheet.png', '../../sprites.json')
    },
    create: function () {
      state.game.add.tileSprite(0, 0, window.outerWidth, window.outerHeight, 'background')
      state.girlSprite = state.game.add.sprite(0, 0, 'girl')
      state.girlSprite.animations.add('idle', window.Phaser.Animation.generateFrameNames('idle', 1, 16), 5, true)
      state.girlSprite.scale.setTo(0.5)
    },
    update: function () {
      state.girlSprite.animations.play('idle', 16, true)
    }
  }

  state.game.state.add('initialState', gameState)
  state.game.state.start('initialState')
  // bypass nanorouter assertion returning an empty main
  return document.createElement('main')
}
