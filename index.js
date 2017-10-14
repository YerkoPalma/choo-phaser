var choo = require('choo')
var homeView = require('./views/home')
var stageView = require('./views/stage')
var css = require('sheetify')

css('tachyons', { global: true })

var app = choo()
if (process.env.NODE_ENV !== 'production') {
  // app.use(require('choo-devtools')())
  app.use(require('choo-log')())
}
app.use(clearGame)
app.route('/', homeView)
app.route('/stage/:id', stageView)
var tree = app.start()
document.body.appendChild(tree)

function clearGame (state, emitter) {
  emitter.on('navigate', function () {
    if (state.game) state.game.destroy()
  })
}
