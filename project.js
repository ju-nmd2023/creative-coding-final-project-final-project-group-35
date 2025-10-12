let scroll = 0;
let maxScroll;
let squares = [];

function setup() {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  background(20, 30, 60);

  setupSky();
}

function setupSky() {
  const minSize = 16;
  const maxSize = 50;
  const density = 0.006;

  maxScroll = height * 4;

  const totalSquares = int(width * (height + maxScroll) * density);
  squares = [];

  for (let i = 0; i < totalSquares; i++) {
    const size = random(minSize, maxSize);
    const x = random(-size / 2, width - size / 2);
    const y = random(-size / 2, height + maxScroll - size / 2);
    const r = random(18, 32);
    const g = random(30, 54);
    const b = random(80, 140);
    const alpha = random(140, 210);
    const cornerRadius = random(2, 7);

    squares.push({
      x,
      y,
      size,
      col: [r, g, b, alpha],
      cornerRadius,
    });
  }
}

function draw() {
  background(20, 30, 60);
  drawSkyScrolling();
}

function drawSkyScrolling() {
  push();
  translate(0, -scroll);

  drawSquares();

  pop();
}

function drawSquares() {
  const yOffset = scroll < maxScroll ? scroll : maxScroll;
  for (const square of squares) {
    if (
      square.y + square.size * 2 > yOffset &&
      square.y - square.size * 2 < yOffset + height
    ) {
      const t = square.y / (height + maxScroll);
      const brightness = lerp(0.5, 2.5, t);
      const sizeBoost = lerp(1.0, 2.8, t);

      fill(
        min(square.col[0] * brightness, 255),
        min(square.col[1] * brightness, 255),
        min(square.col[2] * brightness, 255),
        square.col[3]
      );

      rect(
        square.x,
        square.y,
        square.size * sizeBoost,
        square.size * sizeBoost,
        square.cornerRadius
      );
    }
  }
}

function mouseWheel(event) {
  scroll = constrain(scroll + event.deltaY, 0, maxScroll);
  return false;
}
