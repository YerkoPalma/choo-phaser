function GameFactory (opts, state, emit) {
  if (!(this instanceof GameFactory)) return new GameFactory(opts, state)
  // every alternative sprite
  this._srpites = []
  this._game = new window.Phaser.Game('100', '100', window.Phaser.AUTO)
  // app replica state
  this._state = state
  // app replica emitter
  this._emit = emit
  // the main sprite meta data
  this._main = {}
  // the main sprite instance
  this.main = {}
  // TODO: Add appropiate next functions to steps
  this.steps = []
  this.background = {}
  this._assetsFolder = opts.assets || '../..'
  // get the results
  this.results = [{
    time: -1,
    resolved: false,
    mistakes: 0
  },{
    time: -1,
    resolved: false,
    mistakes: 0
  }]
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
      opt.events.onInputUp.add(this.onAnswer(this.steps, this._state, this._emit, opt), opt)
      return opt
    })

    this._state.currentStep = 0
    this._state.currentStage = 0
    var mainAnim = this._main.animations[0]
    this.main.animations.play(mainAnim.name, mainAnim.to, mainAnim.loop)
    this.writeInstructions()
  }
  var update = () => {}
  return {
    preload,
    create,
    update
  }
}

GameFactory.prototype.writeInstructions = function () {
  
}
GameFactory.prototype.onAnswer = function (steps, state, emit, opt) {
  return () => {
    if (steps[state.currentStage][state.currentStep].correctOption === opt.text) {
      emit('tts:speak', {
        text: 'That\'s correct! congratulations',
        id: 'opt'
      })
    } else {
      emit('tts:speak', 'Incorrect! Sorry, please try again')
      this.results[state.currentStage].mistakes++
    }
  }
}
module.exports = GameFactory
