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
    -webkit-box-shadow: 0px 0px 0px 4px #ff6300;
    -moz-box-shadow: 0px 0px 0px 4px #ff6300;
    box-shadow: 0px 0px 0px 1rem #ff6300;
  }
`
var borderSuccess = css`
  :host {
    -webkit-box-shadow: 0px 0px 0px 4px #137752;
    -moz-box-shadow: 0px 0px 0px 4px #137752;
    box-shadow: 0px 0px 0px 1rem #137752;
  }
`
var background = css`
  :host {
    background: url(background.png) no-repeat center center fixed; 
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    position: fixed;
    overflow-y: scroll;
  }
`
module.exports = function (state, emit) {
  var stages = [
    {
      id: 'alphabet',
      name: 'The alphabet'
    }, {
      id: 'numbers',
      name: 'The numbers'
    }, {
      id: 'profesions',
      name: 'The professions'
    }, {
      id: 'my-things',
      name: 'My own things'
    }, {
      id: 'classroom',
      name: 'The classroom'
    }, {
      id: 'actions',
      name: 'Actions'
    }, {
      id: 'food',
      name: 'The food'
    }, {
      id: 'animals',
      name: 'The farm animals'
    }, {
      id: 'qualify',
      name: 'Qualify things'
    }]
  return html`
  <main class="${font} ${background} cf w-100 pa2-ns bg-light-blue vh-100">
    <h1 class="${heading} tc f1 white">Level Select</h1>
    ${stages.map((stage, i) => {
      return html`<article class="fl w-100 w-50-m  w-25-ns pa4">
      <a href="/stage/${stage.id}" class="ph2 ph0-ns pb3 link db">
        <div class="aspect-ratio aspect-ratio--1x1 br4 ma3 ${border}">
          <div class="aspect-ratio aspect-ratio--1x1 ba bw4 br4 
            ${state.stages && state.stages[stage.id] && state.stages[stage.id][0].resolved && state.stages[stage.id][1].resolved
              ? 'b--green bg-green ' + borderSuccess
              : 'b--gold bg-gold ' + border} ">
            <p class="f-headline tc w-100 white">${i + 1}</p>
          </div>
        </div>
        <h3 class="f5 f4-ns mb0 black-90">${stage.name}</h3>
      </a>
    </article>`
    })}
  </main>
  `
}
