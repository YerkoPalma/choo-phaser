window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

module.exports = function (state, emit) {
  state.tts.selectedVoice = state.tts.voices.filter(voice => {
    return voice.lang === 'en-GB'
  })[0]
  state.game = new window.Phaser.Game('100', '100', window.Phaser.AUTO)

  var gameState = {
    preload: function () {
      state.game.load.image('background', '../../background.png')
      state.game.load.atlas('girl', '../../spritesheet.png', '../../sprites.json')
    },
    create: function () {
      // background
      state.backgroundSprite = state.game.add.sprite(0, 0, 'background')
      state.backgroundSprite.height = state.game.height
      state.backgroundSprite.width = state.game.width

      // character
      state.girlSprite = state.game.add.sprite(0, 0, 'girl')
      state.girlSprite.animations.add('idle', window.Phaser.Animation.generateFrameNames('idle', 1, 16), 5, true)
      state.girlSprite.scale.setTo(0.5)
      state.girlSprite.position.y = state.game.height - (state.girlSprite.height * 1.3)

      // instructions
      state.instructions = state.game.add.text(state.game.world.centerX / 2, 50, '', {
        font: '32px Carter One',
        fill: '#FF6300',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: state.game.width / 2
      })
      state.text = ['Complete the following three stages to finish the game']
      writeInstructions()
    },
    update: function () {
      state.girlSprite.animations.play('idle', 16, true)
    }
  }

  var line = []
  var wordIndex = 0
  var lineIndex = 0
  var wordDelay = 60
  var lineDelay = 400

  state.game.state.add('initialState', gameState)
  state.game.state.start('initialState')
  // bypass nanorouter assertion returning an empty main
  return document.createElement('main')

  function writeInstructions () {
    if (lineIndex === state.text.length) {
      // clear text
      setTimeout(() => {
        state.instructions.text = ''
      }, 1500)
      // We're finished
      return
    }

    //  Split the current line on spaces, so one letter per array element
    line = state.text[lineIndex].split('')
    // Say the line
    emit('log:info', state.tts.selectedVoice)
    emit('tts:speak', state.text[lineIndex])

    //  Reset the word index to zero (the first word in the line)
    wordIndex = 0

    //  Call the 'nextWord' function once for each word in the line (line.length)
    state.game.time.events.repeat(wordDelay, line.length, nextWord, this)

    //  Advance to the next line
    lineIndex++
  }

  function nextWord () {
    //  Add the next word onto the text string, followed by a space
    state.instructions.text = state.instructions.text.concat(line[wordIndex])

    //  Advance the word index to the next word in the line
    wordIndex++

    //  Last word?
    if (wordIndex === line.length) {
      //  Add a carriage return
      state.instructions.text = state.instructions.text.concat('\n')

      //  Get the next line after the lineDelay amount of ms has elapsed
      state.game.time.events.add(lineDelay, writeInstructions, this)
    }
  }
}
