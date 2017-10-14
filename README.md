# choo-phaser

Just me playing with phaser and choo

# Why?

I want (need) to make a web game and phaser seems to be a very good option. 
Now, even a web game is a web app, and for web app, the framework I've chosen is choo,
but phaser games and tutorials tend to assume that your whole app is a game and 
control your actions, flow, menus and whatever from the same phaser game.

That's not what I want, I want to manage my flow sith choo, and use phaser 
as a game in a choo view.

# How?

So, to do that, I have some tasks to achieve:

- [x] Use phaser with browserify

Phaser originally wasn't build to be modular. Now, version 3 is being rebuild as a 
modular library, but it is still not production ready, so I had to find a way to use it 
with browserify. My first, obvious attempt, was:

```js
var Phaser = require('phaser')
```

Which failed because of

```js
PIXI is undefined
```

I've already knew that phaser uses PIXI as game renderer, so googled if it was included 
in phaser build. I found that I could load it all with

```js
window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')
```

And then, no error :)

- [x] Add a phaser instance as a whole choo view

So, I tried to use a game instance as a choo view like this

```js
window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

module.exports = function (state, emit) {
  state.game = new window.Phaser.Game('100', '100', window.Phaser.AUTO)

  var gameState = {
    preload: function () {
    },
    create: function () {
    },
    update: function () {
    }
  }

  state.game.state.add('initialState', gameState)
  state.game.state.start('initialState')
}
```

What is different here is that everything related to phaser is set to 
some property of the choo state so I could use it later. Anyway this failed, 
because nanomorph complained that I was returning `undefined` instead of a 
`MAIN` element. Litle pause here. I usually don't do like 

```js
var app = choo()
app.route('/', mainView)
app.mount('body')
```

I tend to prefer like

```js
var app = choo()
var tree = app.start()
document.body.appendChild(tree)
```

That's why nanomorph complain about a main element. So I have to return a new empty 
element in the view that has my phaser game.


