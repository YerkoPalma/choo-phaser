var html = require('choo/html')
var css = require('sheetify')

var font = css`
  @import url('https://fonts.googleapis.com/css?family=Carter+One');
  :host {
    font-family: 'Carter One', cursive;
  }
`
var heading = css`
  :host {
    text-shadow: #aaa 5px 3px 18px;
  }
`
module.exports = function (state, emit) {
  return html`
  <main class="cf w-100 pa2-ns green ${font} ${heading}">
    <h1 class="tc f1">Level Select</h1>
    <article class="fl w-100 w-50-m  w-25-ns pa2-ns">
      <div class="aspect-ratio aspect-ratio--1x1 ba bw4 b--orange br4">
        <div class="ba bw4 b--gold br4 bg-gold">
        </div>
      </div>
      <a href="/stage/demo" class="ph2 ph0-ns pb3 link db">
        <h3 class="f5 f4-ns mb0 black-90">Demo game</h3>
        <h3 class="f6 f5 fw4 mt2 black-60">Puntaje total 0</h3>
      </a>
    </article>
  </main>
  `
}
