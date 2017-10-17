var choo = require('choo')
var tts = require('choo-tts')
var homeView = require('./views/home')
var stageView = require('./views/stage')
var css = require('sheetify')

css('tachyons', { global: true })

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  app.use(require('choo-devtools')())
  app.use(require('choo-log')())
}
app.use(tts)
app.use(clearGame)
app.use(interactive)
app.route('/', homeView)
app.route('/stage/:id', stageView)
var tree = app.start()
document.body.appendChild(tree)

function clearGame (state, emitter) {
  emitter.on('navigate', function () {
    if (state.game) state.game.destroy()
  })
}

function interactive (state, emitter) {
  emitter.once('tts:voices-changed', function () {
    // select an en-UK voice
    state.tts.selectedVoice = state.tts.voices.filter(voice => {
      return voice.lang === 'en-GB'
    })[0]
    // talk a bit slower, they are just kids
    state.tts.rate = 0.9
    emitter.emit('log:info', state.tts.selectedVoice)
    emitter.emit('tts:speak', 'Welcome buddy! Please select a game level...')
  })
}
