document.addEventListener('DOMContentLoaded', () => {
  const width = 21
  const height = 15
  const cellSize = 30 // withd/height of single cell in pixels
  generateBoard(); // Must be first

  const SHOOTER_RIGHT = (width * height - 1) - width // Most right postition of Shooter
  const SHOOTER_LEFT = SHOOTER_RIGHT - (width - 1)  // Most left postition of Shooter
  let isGameOver = false;
  
  const squares = document.querySelectorAll('.grid div')
  const resultDisplay = document.querySelector('#result')
  let currentShooterIndex = (width * height - 2) - (3 * Math.trunc(width / 2)) // Last position - 3 of half-width
  let currentInvaderIndex = 0
  let alienInvadersTakenDown = [] // Array of killed??
  let result = 0
  let direction = 1
  let invaderId


  // Define the alien invaders
  const invaderRowCount = 4;
  const invaders = []
  generateInvaders();

  //draw the shooter
  squares[currentShooterIndex].classList.add('shooter')

  // Generates widht*heights amount of divs
  function generateBoard() {
    console.log('generateBoard()');
    const grid = document.getElementById("grid");

    // Set width and height by cellSize
    grid.style.width = width * cellSize + "px";
    grid.style.height = height * cellSize + "px";

    // Generate width * height amount of cells
    for (let i = 0; i < width * height; i++) {
      const div = document.createElement("div");
      grid.appendChild(div);
    }
  }
 
  // Generate invaders
  function generateInvaders() {

    function generateRowOfInviders(number) {
      for (let i = 0; i < width - 3; i++) {
        invaders.push((number * width) +  i);
      }
    }

    for (let i = 0; i < invaderRowCount; i++ ) {
      generateRowOfInviders(i);
    } 

    console.log('generateInvaders() - invaders:', invaders);

    //draw the alien invaders
    invaders.forEach( invader => squares[currentInvaderIndex + invader].classList.add('invader'))
  }


  //move the shooter along a line
  function moveShooter(e) {
    if (isGameOver) {
      return;
    }
    
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.keyCode) {
      case 65: 
      case 37: 
        // Left Arrow
        if (currentShooterIndex % width !== 0) {
          currentShooterIndex = currentShooterIndex - 1
          // currentShooterIndex -= 1
        }  
        break
      case 68: 
      case 39: 
        // Right Arrow
        if (currentShooterIndex % width < width - 1) {
          currentShooterIndex = currentShooterIndex + 1
          // currentShooterIndex += 1
        }
        break
      case 81:
        // Jump most Lest 
        currentShooterIndex = SHOOTER_LEFT
        break
      case 69:
        // Jump most right
        currentShooterIndex = SHOOTER_RIGHT
        break    
      case 83: 
      case 40:
        // Jump center
        const length = width - 1 // Math.abs(SHOOTER_RIGHT - SHOOTER_LEFT)
        const halfLength = Math.round(length / 2)
        const centerAt = SHOOTER_LEFT + halfLength
        currentShooterIndex = centerAt
//        currentShooterIndex = SHOOTER_LEFT + Math.round(Math.abs(SHOOTER_RIGHT - SHOOTER_LEFT) / 2)
        break   
      
    }
    squares[currentShooterIndex].classList.add('shooter')
    // console.log('currentShooterIndex:', currentShooterIndex)
  }
  document.addEventListener('keydown', moveShooter)

  // Move the alien invaders
  function moveInvaders() {
    if (isGameOver) {
      return;
    }

    const leftEdge = invaders[0] % width === 0
    const rightEdge = invaders[invaders.length - 1] % width === width - 1

      if((leftEdge && direction === -1) || (rightEdge && direction === 1)){
        direction = width
      } else if (direction === width) {
      if (leftEdge) direction = 1
      else direction = -1
      }
      for (let i = 0; i <= invaders.length - 1; i++) {
        squares[invaders[i]].classList.remove('invader')
      }
      for (let i = 0; i <= invaders.length - 1; i++) {
        invaders[i] += direction
      }
      for (let i = 0; i <= invaders.length - 1; i++) {
      //ADD IF LATER
        if (!alienInvadersTakenDown.includes(i)){
          squares[invaders[i]].classList.add('invader')
        }
      }

    if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      isGameOver = true;
      resultDisplay.textContent = 'Game Over'
      squares[currentShooterIndex].classList.add('boom')
      clearInterval(invaderId)
    }

    for (let i = 0; i <= invaders.length - 1; i++){
      if(invaders[i] > (squares.length - (width - 1))){
        isGameOver = true;
        resultDisplay.textContent = 'Game Over'
        clearInterval(invaderId)
      }
    }

    //ADD LATER
    if(alienInvadersTakenDown.length === invaders.length) {
      isGameOver = true;
      console.log(alienInvadersTakenDown.length)
      console.log(invaders.length)
      resultDisplay.textContent = 'You Win'
      clearInterval(invaderId)
    }
  }
  invaderId = setInterval(moveInvaders, 500)

  //shoot at aliens
  function shoot(e) {
    if (isGameOver) {
      return;
    }

    let laserId
    let currentLaserIndex = currentShooterIndex
    //move the laser from the shooter to the alien invader
    function moveLaser() {
      squares[currentLaserIndex].classList.remove('laser')
      currentLaserIndex -= width
      squares[currentLaserIndex].classList.add('laser')
      if(squares[currentLaserIndex].classList.contains('invader')) {
        squares[currentLaserIndex].classList.remove('laser')
        squares[currentLaserIndex].classList.remove('invader')
        squares[currentLaserIndex].classList.add('boom')

        setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250)
        clearInterval(laserId)

        const alienTakenDown = invaders.indexOf(currentLaserIndex)
        alienInvadersTakenDown.push(alienTakenDown)
        result++
        resultDisplay.textContent = result
      }

      if(currentLaserIndex < width) {
        clearInterval(laserId)
        setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100)
      }
    }

    // document.addEventListener('keyup', e => {
    //   if (e.keyCode === 32) {
    //     laserId = setInterval(moveLaser, 100)
    //   }
    // })

    switch(e.keyCode) {
      case 38:
      case 87:
      case 32:
        laserId = setInterval(moveLaser, 100)
        break
    }
  }

  document.addEventListener('keyup', shoot)


})
