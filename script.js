const MAXKEY = 90
const MINKEY = 65


let levels
let keys
let userTurn = false
let speed



function generateRandomKey() {
  return Math.round(Math.random() * (MAXKEY - MINKEY) + MINKEY)
}
function generateKeys(levels) {
  return new Array(levels)
    .fill(0)
    .map(generateRandomKey)
}

function chooseLevel(){
  swal('Hey! Follow the machine to win, select your difficulty:', {
    buttons : {
      easy: true,
      normal: true,
      hard: true
    },
    closeOnClickOutside: false
  })
  .then( (value) => {
    switch (value) {
      case 'easy':
        speed = 1000
        levels = 5
        keys = generateKeys(levels)
        nextLevel(0)
      break;

      case 'normal':
        speed = 600
        levels = 10
        keys = generateKeys(levels)
        nextLevel(0)
      break;

      case 'hard':
        speed = 500
        levels = 15
        keys = generateKeys(levels)
        nextLevel(0)
      break;

      default:
    }
  })
}
function levelModal(currentLevel) {
  swal({
    title     : `Nivel ${currentLevel + 1} / ${levels}`,
    buttons   : false,
    className : 'swal-level',
    timer     : 1500
  })
}
function activateSequence(currentLevel) {
  for(let i = 0 ; i <= currentLevel; i++) {
    setTimeout( () => {
      activateKey(keys[i])
      if(i == currentLevel) {
        setTimeout( () => {
          console.log('q putas');
          userTurn = true
        }, 1000)
      }
    }, speed * ( i + 1) )
  }
}

function nextLevel(currentLevel) {
  userTurn = false

  if(currentLevel == levels) {
    return swal('Felicitaciones Ganaste :) ' , '' , 'success')
  }
  levelModal(currentLevel)
  setTimeout( () => activateSequence(currentLevel) , 1500)
  window.addEventListener('keyup', onkeyup)
  let i = 0
  let currentKey = keys[i]


  function onkeyup(ev){
    $keyUpCode = ev.keyCode
    if(userTurn){
      if($keyUpCode == currentKey) {
        activateKey($keyUpCode, {success : true})
        i++
        if(i > currentLevel) {
          window.removeEventListener('keyup', onkeyup)
          setTimeout( () => nextLevel(i) , 1500)
        }
        currentKey = keys[i]
      } else{
          activateKey($keyUpCode , {fail : true})
          window.removeEventListener('keyup', onkeyup)
          setTimeout(() =>
          swal('Perdiste :(', {
            icon                : 'error',
            closeOnClickOutside : false,
            button              : "Volver a jugar"
          }).then(chooseLevel), 1000 )
      }
    }
  }
}

function getElementByKeyCode(keyCode) {
  return document.querySelector(`[data-key = "${keyCode}"]`)
}

function activateKey(keyCode , opts = {}) {
  const $key = getElementByKeyCode(keyCode)
  $key.classList.add('active')
  if(opts.success) {
    $key.classList.add('success')
  } else if (opts.fail) {
    $key.classList.add('fail')
  }
  setTimeout( () => deactivate($key) , speed)
}

function deactivate($key) {
	$key.className = 'key'
}

chooseLevel()
