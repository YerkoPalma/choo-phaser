window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

module.exports = function (state, emit) {
  state.tts.selectedVoice = state.tts.voices.filter(voice => {
    return voice.lang === 'en-GB'
  })[0]
  state.game = new window.Phaser.Game('100', '100', window.Phaser.AUTO)

  var line = []
  var wordIndex = 0
  var lineIndex = 0
  var gameState = {
    preload: function () {
      state.game.load.image('background', '../../background.png')
      state.game.load.atlas('girl', '../../spritesheet.png', '../../sprites.json')
      state.game.load.image('kids', '../../singing.png')
    },
    create: function () {
      // background
      state.backgroundSprite = state.game.add.sprite(0, 0, 'background')
      state.backgroundSprite.height = state.game.height
      state.backgroundSprite.width = state.game.width

      // character
      state.girlSprite = state.game.add.sprite(0, 0, 'girl')
      state.girlSprite.animations.add('idle', window.Phaser.Animation.generateFrameNames('idle', 1, 16), 16, true)
      state.girlSprite.animations.add('walk', window.Phaser.Animation.generateFrameNames('walk', 1, 20), 20, false)
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

      // options
      state.options = [0, 1, 2, 3, 4].map((_, i) => {
        var opt = state.game.add.text((i * 150) + state.game.world.centerX / 2, 50, '', {
          font: '146px Skranji',
          fill: '#FF6300',
          align: 'center',
          wordWrap: true,
          wordWrapWidth: state.game.width / 2
        })
        opt.stroke = '#FF0000'
        opt.strokeThickness = 12
        opt.setShadow(2, 2, '#333333', 2)
        opt.inputEnabled = true
        opt.input.useHandCursor = true
        opt.events.onInputUp.add(() => {
          if (state.steps[state.currentStep].correctOption === opt.text) {
            emit('tts:speak', {
              text: 'That\'s correct! congratulations',
              id: 'opt'
            })
            // else finish
          } else {
            emit('tts:speak', 'Incorrect! Sorry, please try again')
          }
        }, opt)
        return opt
      })
      state.steps = [
        {
          instructions: [
            'Complete the following three stages to finish the game',
            'Stage 1: Select the correct numbers',
            'From the singing kids, how many of them have dresses?'
          ],
          options: ['1', '2', '3', '4', '5'],
          correctOption: '2',
          next
        },
        {
          instructions: [
            'How many kids have their eyes closed?'
          ],
          options: ['3', '2', '1', '4', '6'],
          correctOption: '4',
          next
        }
      ]
      state.currentStep = 0
      state.girlSprite.animations.play('idle', 16, true)
      writeInstructions()
    },
    update: function () {}
  }

  var wordDelay = 60
  var lineDelay = 400

  state.game.state.add('initialState', gameState)
  state.game.state.start('initialState')
  // bypass nanorouter assertion returning an empty main
  return document.createElement('main')

  function next () {
    if (state.currentStep < state.steps.length - 1) {
      line = []
      wordIndex = 0
      lineIndex = 0
      state.currentStep++
      writeInstructions()
    } else {
      state.kids.destroy()
      // move the girl
      // var idleAnimation = state.girlSprite.animations.getAnimation('idle')
      // var walkAnimation = state.girlSprite.animations.getAnimation('walk')

      // idleAnimation.paused = true
      // state.girlSprite.animations.play('walk', 20, true)
      // state.girlSprite.animations.currentAnim = walkAnimation
      state.girlSprite.animations.play('walk', 20, true)
      state.game.add.tween(state.girlSprite).to({
        x: state.girlSprite.position.x + 200
      }, 3000, null, true).onComplete.add((girlSprite, tween) => {
        state.girlSprite.animations.play('idle', 16, true)
      })
    }
  }
  function writeInstructions () {
    if (lineIndex === 0) {
      state.options.map((opt, i) => {
        opt.text = ''
      })
    }
    if (lineIndex === state.steps[state.currentStep].instructions.length) {
      // We've finished
      state.options.map((opt, i) => {
        opt.text = state.steps[state.currentStep].options[i]
      })
      return
    }
    if (lineIndex === 2) {
      state.kids = state.game.add.sprite(state.game.world.centerX / 2, 220, 'kids')
      state.kids.scale.setTo(0.7)
    }

    //  Split the current line on spaces, so one letter per array element
    line = state.steps[state.currentStep].instructions[lineIndex].split('')
    // Say the line
    emit('tts:speak', state.steps[state.currentStep].instructions[lineIndex])

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
      // clear text
      setTimeout(() => {
        state.instructions.text = ''
        //  Get the next line after the lineDelay amount of ms has elapsed
        state.game.time.events.add(lineDelay, writeInstructions, this)
      }, 1000)
    }
  }
}
