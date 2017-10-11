var html = require('choo/html')
var css = require('sheetify')

var font = css`
  @import url('https://fonts.googleapis.com/css?family=Carter+One');
  @import url('https://fonts.googleapis.com/css?family=Skranji');
  :host {
    font-family: 'Carter One', cursive;
  }
  :host p {
    font-family: 'Skranji', cursive;
  }
`
var heading = css`
  :host {
    text-shadow: #aaa 5px 3px 18px,
      -1px -1px 0 #137752,
       1px -1px 0 #137752,
      -1px  1px 0 #137752,
       1px  1px 0 #137752;
    -webkit-text-stroke: 1px #137752;
    -webkit-text-fill-color: white;
  }
`
var border = css`
  :host {
    -webkit-box-shadow: 0px 0px 0px 4px #fff;
    -moz-box-shadow: 0px 0px 0px 4px #fff;
    box-shadow: 0px 0px 0px 1rem #ff6300;
  }
`
module.exports = function (state, emit) {
  return html`
  <main class="${font} cf w-100 pa2-ns bg-light-blue vh-100">
    <h1 class="${heading} tc f1 white">Level Select</h1>
    <article class="fl w-100 w-50-m  w-25-ns pa2-ns">
      <div class="aspect-ratio aspect-ratio--1x1 br4 ma3 ${border}">
        <div class="aspect-ratio aspect-ratio--1x1 ba bw4 b--gold br4 bg-gold">
          <p class="f-headline tc w-100 white">1</p>
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
