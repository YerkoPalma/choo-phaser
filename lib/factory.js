function GameFactory (opts, state, emit) {
  if (!(this instanceof GameFactory)) return new GameFactory(opts, state, emit)
  // every alternative sprite metadata
  this._sprites = opts.sprites || []
  emit('log:info', this._sprites)
  // every sprite instance
  this.sprites = {}
  this._game = new window.Phaser.Game('100', '100', window.Phaser.AUTO)
  // app replica state
  this._state = state
  // app replica emitter
  this._emit = emit
  // the main sprite meta data
  this._main = opts.mainSprite || {}
  // the main sprite instance
  this.main = {}
  // TODO: Add appropiate next functions to steps
  this._state.steps = opts.steps || []
  this._state.steps[0].forEach((step, i) => {
    this._state.steps[0][i] = Object.assign(step, { next: this.onNextStep.bind(this) })
  })
  this._state.steps[1].forEach((step, i) => {
    this._state.steps[1][i] = Object.assign(step, { next: this.onNextStep.bind(this) })
  })
  this.background = {}
  this._assetsFolder = opts.assets || '../..'
  // get the results
  this.results = [{
    time: -1,
    resolved: false,
    mistakes: 0
  }, {
    time: -1,
    resolved: false,
    mistakes: 0
  }]
  this._start = -1

  this.getState = this.getState.bind(this)
  this.writeInstructions = this.writeInstructions.bind(this)
  this.onStageFinished = this.onStageFinished.bind(this)
  this.onNextStep = this.onNextStep.bind(this)
  this.onAnswer = this.onAnswer.bind(this)
}

GameFactory.prototype.getState = function () {
  var preload = () => {
    // background
    this._game.load.image('background', `${this._assetsFolder}/background.png`)
    // main
    this._game.load.atlas(this._main.name, `${this._assetsFolder}/spritesheet.png`, `${this._assetsFolder}/sprites.json`)
    // sprites
    this._sprites.map(sprite => {
      this._game.load.image(sprite.name, `${this._assetsFolder}/${sprite.file}`)
    })
  }
  var create = () => {
    // background
    this.background = this._game.add.sprite(0, 0, 'background')
    this.background.height = this._game.height
    this.background.width = this._game.width

    // main character
    this.main = this._game.add.sprite(0, 0, this._main.name)
    Object.keys(this._main.animations).map(animation => {
      var anim = this._main.animations[animation]
      this.main.animations.add(animation, window.Phaser.Animation.generateFrameNames(animation, anim.from, anim.to), anim.to, !!anim.loop)
    })
    this.main.scale.setTo(0.5)
    this.main.position.y = this._game.height - (this.main.height * 1.2)

    // instructions
    this.instructions = this._game.add.text(this._game.world.centerX / 2, 50, '', {
      font: '32px Carter One',
      fill: '#FF6300',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: this._game.width / 2
    })

    // options
    this.options = [0, 1, 2, 3, 4].map((_, i) => {
      var opt = this._game.add.text((i * 150) + this._game.world.centerX / 2, 50, '', {
        font: '146px Skranji',
        fill: '#eeeeee',
        align: 'center',
        wordWrap: true,
        wordWrapWidth: this._game.width / 2
      })
      opt.stroke = '#FF0000'
      opt.strokeThickness = 12
      opt.inputEnabled = true
      opt.input.useHandCursor = true
      opt.events.onInputUp.add(this.onAnswer(opt), opt)
      return opt
    })

    this._state.currentStep = 0
    this._state.currentStage = 0
    var mainAnim = this._main.animations[this._main.mainAnimation]
    this.main.animations.play(this._main.mainAnimation, mainAnim.to, mainAnim.loop)
    this._start = new Date()
    this.writeInstructions([], 0, 0)
  }
  var update = () => {}
  return {
    preload,
    create,
    update
  }
}

GameFactory.prototype.writeInstructions = function (line, wordIndex, lineIndex, start, lineDelay = 400, wordDelay = 60) {
  if (lineIndex === 0) {
    this.options.map((opt, i) => {
      opt.text = ''
    })
  }
  if (lineIndex === this._state.steps[this._state.currentStage][this._state.currentStep].instructions.length) {
    // Time to display options
    // and start measuring time
    this.options.map((opt, i) => {
      opt.text = this._state.steps[this._state.currentStage][this._state.currentStep].options[i]
    })
    return
  }
  if (lineIndex === 2) {
    // show alternative sprites?
    this._sprites.forEach(_sprite => {
      this.sprites[_sprite.name] = this._game.add.sprite(this._game.world.centerX / 2, 220, _sprite.name)
      this.sprites[_sprite.name].scale.setTo(0.7)
    })
  }

  // Split the current line on spaces, so one letter per array element
  line = this._state.steps[this._state.currentStage][this._state.currentStep].instructions[lineIndex].split('')
  // Say the line
  this._emit('tts:speak', this._state.steps[this._state.currentStage][this._state.currentStep].instructions[lineIndex])

  //  Reset the word index to zero (the first word in the line)
  wordIndex = 0

  //  Call the 'nextWord' function once for each word in the line (line.length)
  this._game.time.events.repeat(wordDelay, line.length, nextWord(line, ++lineIndex, wordIndex, lineDelay), this)

  //  Advance to the next line
  // lineIndex++
}
function nextWord (line, lineIndex, wordIndex, lineDelay) {
  return function () {
    //  Add the next word onto the text string, followed by a space
    this.instructions.text = this.instructions.text.concat(line[wordIndex])

    //  Advance the word index to the next word in the line
    wordIndex++

    //  Last word?
    if (wordIndex === line.length) {
      // clear text
      setTimeout(() => {
        this.instructions.text = ''
        //  Get the next line after the lineDelay amount of ms has elapsed
        this._game.time.events.add(lineDelay, () => {
          this.writeInstructions(line, wordIndex, lineIndex, new Date())
        }, this)
      }, 1000)
    }
  }
}
GameFactory.prototype.onStageFinished = function () {
  var end = new Date()
  var results = {
    time: Math.abs((this._start.getTime() - end.getTime()) / 1000),
    resolved: true,
    mistakes: this.results[this._state.currentStage].mistakes
  }
  this.results[this._state.currentStage] = results
  // this.results[this._state.currentStage].mistakes = 0
  if (this._state.currentStage < this._state.steps.length - 1) {
    this._state.currentStage++
    this._state.currentStep = 0
    var line = []
    var wordIndex = 0
    var lineIndex = 0
    // TODO: replace for appropiate sprites
    this._sprites.forEach(_sprite => {
      this.sprites[_sprite.name].destroy()
    })
    this.main.animations.play('walk', 20, true)
    this._game.add.tween(this.main).to({
      x: this._game.width * 0.4
    }, 3000, null, true).onComplete.add((girlSprite, tween) => {
      this.main.animations.play('idle', 16, true)
      this._start = new Date()
      this.writeInstructions(line, wordIndex, lineIndex)
    })
  } else {
    // both stages re finished animate and go back
    this.main.animations.play('walk', 20, true)
    this._game.add.tween(this.main).to({
      x: this._game.width
    }, 3000, null, true).onComplete.add((girlSprite, tween) => {
      // save results
      this._state.stages.push(this.results)
      this.results = []
      this._state.game = this._game
      setTimeout(() => this._emit(this._state.events.PUSHSTATE, '/'), 1500)
    })
  }
}
GameFactory.prototype.onNextStep = function () {
  if (this._state.currentStep < this._state.steps[this._state.currentStage].length - 1) {
    var line = []
    var wordIndex = 0
    var lineIndex = 0
    this._state.currentStep++
    this.writeInstructions(line, wordIndex, lineIndex)
  } else {
    this.onStageFinished()
  }
}
GameFactory.prototype.onAnswer = function (opt) {
  return () => {
    if (this._state.steps[this._state.currentStage][this._state.currentStep].correctOption === opt.text) {
      this._emit('tts:speak', {
        text: 'That\'s correct! congratulations',
        id: 'opt'
      })
    } else {
      this._emit('tts:speak', 'Incorrect! Sorry, please try again')
      this.results[this._state.currentStage].mistakes++
    }
  }
}
GameFactory.prototype.start = function () {
  this._game.state.add('initialState', this.getState())
  this._game.state.start('initialState')
}
module.exports = GameFactory
