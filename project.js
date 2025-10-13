let yScroll = 0;
let maxYScroll = 3328;
let squares = [];
let hScroll = 0;
let maxHScroll = 2560;

const starCount = 100;
let stars = [];
let starLayer;

function setup() {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  background(20, 30, 60);

  // The use of createGraphics function was provided by perplexity, referencing p5js documentation.
  // Link - https://www.perplexity.ai/search/i-m-working-on-a-project-using-mnRYqlI4Rg2g.NlV_rvFZA#0
  starLayer = createGraphics(width, height);

  setupSky();
  setupStars();
}

function setupSky() {
  const minSize = 16;
  const maxSize = 50;
  const density = 0.006;

  maxYScroll = height * 4;
  maxHScroll = width * 2;

  const totalSquares = int(width * (height + maxYScroll) * density);
  squares = [];

  for (let i = 0; i < totalSquares; i++) {
    const size = random(minSize, maxSize);
    const x = random(-size / 2, width + maxHScroll - size / 2);
    const y = random(-size / 2, height + maxYScroll - size / 2);
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

function setupStars() {
  initializeStars();
  drawStarsLayer();
}

function initializeStars() {
  stars = Array.from({ length: starCount }, () => {
    return {
      x: random(width),
      y: random() * random() * height,
      r: random(0.6, 2.0),
      base: random(180, 255),
    };
  });
}

function drawStarsLayer() {
  starLayer.clear();
  starLayer.noStroke();

  starLayer.drawingContext.shadowBlur = 6;
  starLayer.drawingContext.shadowColor = "rgba(255,255,255,0.7)";

  for (const star of stars) {
    const verticalPositionRatio = constrain(star.y / height, 0, 1);
    const brightnessFade = lerp(1.0, 0.2, verticalPositionRatio);
    const grayLevel = star.base * brightnessFade;

    starLayer.fill(grayLevel, grayLevel, grayLevel, 230);
    starLayer.circle(star.x, star.y, star.r * 2);
  }
}

function draw() {
  background(20, 30, 60);
  drawSkyScrolling();
}

function drawSkyScrolling() {
  push();
  if (yScroll < maxYScroll) {
    translate(0, -yScroll);
    drawSquares();
  } else {
    translate(-hScroll, -maxYScroll);
    drawSquares();
  }
  image(starLayer, 0, 0);
  pop();
}

function drawSquares() {
  const yOffset = yScroll < maxYScroll ? yScroll : maxYScroll;
  const xOffset = yScroll < maxYScroll ? 0 : hScroll;

  for (const square of squares) {
    if (
      square.x + square.size * 2 > xOffset &&
      square.x - square.size * 2 < xOffset + width &&
      square.y + square.size * 2 > yOffset &&
      square.y - square.size * 2 < yOffset + height
    ) {
      const t = square.y / (height + maxYScroll);
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
  if (yScroll < maxYScroll) {
    yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
  } else {
    if (event.deltaY > 0 || hScroll > 0) {
    hScroll = constrain(hScroll + event.deltaY, 0, maxHScroll);
      if (hScroll <= 0 && event.deltaY < 0) {
        yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
        hScroll = 0;
      }
    } else {
      yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
    }
  }
  return false;
}
