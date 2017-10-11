var choo = require('choo')
var homeView = require('./views/home')
var stageView = require('./views/stage')
var css = require('sheetify')

css('tachyons', { global: true })

var app = choo()
app.route('/', homeView)
app.route('/stage/:id', stageView)
var tree = app.start()
document.body.appendChild(tree)
