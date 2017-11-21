var choo = require('choo')
var tts = require('choo-tts')
var homeView = require('./views/home')
var stageView = require('./views/stage')
var css = require('sheetify')

css('tachyons', { global: true })

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
}
app.use(tts)
app.use(game)
app.use(interactive)
app.route('/', homeView)
app.route('/stage/:id', stageView)
var tree = app.start()
document.body.appendChild(tree)

function game (state, emitter) {
  // init game
  state.stages = [] // here goes any result
  // clear game
  emitter.on('navigate', function () {
    if (state.game) state.game.destroy()
  })
}

function interactive (state, emitter) {
  emitter.on('tts:voices-changed', function () {
    // select an en-UK voice
    emitter.emit('tts:set-voice', 'Google UK English Female')
    // talk a bit slower, they are just kids
    state.tts.rate = 0.9
  })
  emitter.on('tts:speech-end', function ({ event, id }) {
    if (id === 'opt') state.steps[state.currentStage][state.currentStep].next()
  })
}
