const canvas = document.getElementById('coolDudeCanvas');
const _g = canvas.getContext('2d');

let gameInterval;
let player;

class Square {
  constructor(_color, _x, _y) {
    this.color = _color;
    this.height = 15;
    this.width = 35;
    this.x = _x;
    this.y = _y;
  }

  move(moveXandY) {
    const xMove = moveXandY[0];
    const yMove = moveXandY[1];

    this.x += xMove;
    this.y += yMove;
  }

  shiftColor(_color) {
    this.color = _color;
  }

  render() {
    _g.fillStyle = this.color;
    _g.fillRect(this.x, this.y, this.width, this.height);
  }
}

class GameManager {
  static getInput(){
    let gamepad = navigator.getGamepads()[0];
    if (!gamepad) return;

    gamepad = gamepad.buttons.length ? gamepad : navigator.getGamepads()[1];

    const moveXAndY = this.getGamePadInput(gamepad);

    player.move(moveXAndY);
  }

  static getGamePadInput(gamepad) {
    let xMove = 0;
    let yMove = 0;

    let joystickX = applyDeadzone(gamepad.axes[0], 0.25);
    let joystickY = applyDeadzone(gamepad.axes[1], 0.25);

    //If Joystick is tilted RIGHT
    if (joystickX > 0)
      xMove += 4;
    //If Joystick is tilted LEFT
    if (joystickX < 0)
      xMove -= 4
    //If Joystick is tilted DOWN
    if (joystickY > 0)
      yMove += 2;
    //If Joystick is tiled UP
    if (joystickY < 0)
      yMove -= 2;

    if (gamepad.buttons === undefined || gamepad.buttons === []) {
      alert("buttons array undefined or empty. reconnect?");
    }

    // If green 'A' button is pressed
    if (gamepad.buttons[0].value > 0.5)
      player.shiftColor('green');
    // If red 'B' button is pressed
    if (gamepad.buttons[1].value > 0.5)
      player.shiftColor('red');
    // If blue 'X' button is pressed
    if (gamepad.buttons[2].value > 0.5)
      player.shiftColor('blue');
    // If yellow 'Y' button is pressed
    if (gamepad.buttons[3].value > 0.5)
      player.shiftColor('yellow');

    return [xMove, yMove];

    function applyDeadzone(number, threshold){
      let percentage = (Math.abs(number) - threshold) / (1 - threshold);

      if(percentage < 0)
        percentage = 0;

      return percentage * (number > 0 ? 1 : -1);
    }
  }

  static render(){
    _g.clearRect(0, 0, canvas.width, canvas.height);
    player.render();
  }
}

const gameLoop = () => {
  GameManager.getInput();
  GameManager.render();
};

const gameSetup = () => {
  player = new Square('#ff0000', 5, 5);
  gameInterval = setInterval(gameLoop, 17);
};

gameSetup();
