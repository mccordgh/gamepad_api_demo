let gameInterval, player;
let keys = [], entities = [];
const LEFT_ARROW = 37;
const UP_ARROW = 38;
const RIGHT_ARROW = 39;
const DOWN_ARROW = 40;
const YELLOW_KEY = 87;  // W KEY
const BLUE_KEY = 65;    // A KEY
const GREEN_KEY = 90;   // Z KEY
const RED_KEY = 83;     // S KEY

const canvas = document.getElementById('coolDudeCanvas');
const _g = canvas.getContext('2d');

class Square {
  constructor(_color, _x = 50, _y = 50) {
    this.color = _color;
    this.height = 25;
    this.width = 75;
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
    const gamepad = navigator.getGamepads()[0];

    const moveXAndY = gamepad ? this.getGamePadInput() : this.getKeyBoardInput();

    player.move(moveXAndY);

  }

  static getKeyBoardInput() {
    let xMove = 0;
    let yMove = 0;

    if (keys[LEFT_ARROW]) xMove -= 4;
    if (keys[UP_ARROW]) yMove -= 2;
    if (keys[RIGHT_ARROW]) xMove += 4;
    if (keys[DOWN_ARROW]) yMove += 2;
    if (keys[YELLOW_KEY]) player.shiftColor('yellow');
    if (keys[BLUE_KEY]) player.shiftColor('blue');
    if (keys[GREEN_KEY]) player.shiftColor('green');
    if (keys[RED_KEY]) player.shiftColor('red');

    return [xMove, yMove];
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

    if (gamepad.buttons[0].value > 0.5)
      player.shiftColor('green');
    if (gamepad.buttons[1].value > 0.5)
      player.shiftColor('red');
    if (gamepad.buttons[2].value > 0.5)
      player.shiftColor('blue');
    if (gamepad.buttons[3].value > 0.5)
      player.shiftColor('yellow');

    return [xMove, yMove];

    function applyDeadzone(number, threshold){
      percentage = (Math.abs(number) - threshold) / (1 - threshold);

      if(percentage < 0)
        percentage = 0;

      return percentage * (number > 0 ? 1 : -1);
    }
  }

  static render(){
    _g.clearRect(0, 0, canvas.width, canvas.height);
    entities.forEach((entity) => {
      entity.render();
    });
  }
}

const setKeyTrue = (event) => {
  keys[event.keyCode] = true;
};

const setKeyFalse = (event) => {
  keys[event.keyCode] = false;
};

const setInputEvents = () => {
  document.addEventListener('keydown', setKeyTrue);
  document.addEventListener('keyup', setKeyFalse);
};

const gameLoop = () => {
  GameManager.getInput();
  GameManager.render();
};

const gameSetup = () => {
  player = new Square('#ff0000');
  entities.push(player);
  setInputEvents();
  gameInterval = setInterval(gameLoop, 17);
};

gameSetup();
