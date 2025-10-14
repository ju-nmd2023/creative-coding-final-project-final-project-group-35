let yScroll = 0;
let maxYScroll = 3328;
let squares = [];
let hScroll = 0;
let maxHScroll = 2560;

const starCount = 100;
let stars = [];
let starLayer;

let clouds = [];
let cloudLayer;

function setup() {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  background(20, 30, 60);

  // The use of createGraphics function was provided by perplexity, referencing p5js documentation.
  // Link - https://www.perplexity.ai/search/i-m-working-on-a-project-using-mnRYqlI4Rg2g.NlV_rvFZA#0
  starLayer = createGraphics(width, height);
  setupSky();
  setupStars();

  cloudLayer = createGraphics(width + maxYScroll * 2, height + maxYScroll * 2);
  setupClouds();
  setupCloudsLayer();
}

function setupSky() {
  const minSize = 16;
  const maxSize = 50;
  const density = 0.006;

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
    drawFields();

    let cloudYOffset = yScroll - 1200;
    if (cloudYOffset < 0) cloudYOffset = 0;

    image(cloudLayer, 0, -cloudYOffset);
  } else {
    translate(-hScroll, -maxYScroll);
    drawSquares();
    drawFields();

    image(cloudLayer, -hScroll, -(maxYScroll - 1200));
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
function drawFields() {
  const fieldColors = [
    color(44, 76, 59),
    color(48, 104, 68),
    color(24, 44, 37),
    color(30, 69, 62),
  ];
  const baseH = height + maxYScroll - 120;

  push();
  translate(0, 0);
  for (let i = 3; i >= 0; i--) {
    fill(fieldColors[i]);
    beginShape();
    vertex(0, baseH + 220 + i * 20);

    for (let x = 0; x <= width + maxHScroll; x += 15) {
      const yoff =
        (i + 1) * 75 + (30 + i * 5) * sin(x * (0.002 + 0.0005 * i) + i * 1.5);
      const y = baseH - i * 100 + yoff;
      vertex(x, y);
    }
    vertex(width + maxHScroll, baseH + 220 + i * 20);
    endShape(CLOSE);
  }
  pop();
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

// Clouds
function setupClouds() {
  clouds = [];
  const baseY = height + maxYScroll + 1500;
  const cloudStartY = baseY - 600;
  const cloudEndY = baseY;
  for (let i = 0; i < 120; i++) {
    const cloudWidth = random(180, 320);
    clouds.push({
      x: random(0, width + maxHScroll + 2400),
      y: random(cloudStartY, cloudEndY),
      cloudWidth,
      cloudHeight: random(80, cloudWidth / 2),
    });
  }
}

function setupCloudsLayer() {
  cloudLayer.clear();
  cloudLayer.noStroke();
  for (const cloud of clouds) {
    drawCloudOnLayer(
      cloudLayer,
      cloud.x,
      cloud.y,
      cloud.cloudWidth,
      cloud.cloudHeight
    );
  }
}

// Base functionality adepted from perplexity
// Link - https://www.perplexity.ai/search/i-have-a-function-drawmolnarsq-OYgbluPFRI6rpo7e1LQ_Ig
function drawCloudOnLayer(cloudLayer, centerX, centerY, widthPx, heightPx) {
  const minSide = Math.min(widthPx, heightPx);
  const mixOuterA = color(255, 255, 255, 120);
  const mixOuterB = color(180, 220, 255, 90);
  const mixCoreA = color(255, 255, 255, 180);
  const mixCoreB = color(220, 240, 255, 150);
  const rnd = (a, b) => random(a, b);
  const mix = (a, b) => lerpColor(a, b, random());
  const drawSquare = (x, y, s, c) =>
    drawMolnarSquareOnLayer(cloudLayer, x, y, s, c);

  const outerCount = int(random(20, 30));
  for (let i = 0; i < outerCount; i++) {
    const theta = rnd(0, TWO_PI);
    const radX = rnd(widthPx / 5, widthPx / 2);
    const radY = rnd(heightPx / 5, heightPx / 2);
    const x = centerX + cos(theta) * radX + rnd(-15, 15);
    const y = centerY + sin(theta) * radY + rnd(-12, 12);
    const size = rnd(minSide / 4, minSide / 2);
    drawSquare(x, y, size, mix(mixOuterA, mixOuterB));
  }

  const coreCount = int(outerCount * 0.5);
  for (let i = 0; i < coreCount; i++) {
    const x = centerX + rnd(-widthPx / 10, widthPx / 10);
    const y = centerY + rnd(-heightPx / 10, heightPx / 10);
    const size = rnd(minSide / 5, minSide / 3);
    drawSquare(x, y, size, mix(mixCoreA, mixCoreB));
  }

  cloudLayer.noFill();
  cloudLayer.rectMode(CENTER);
  cloudLayer.strokeWeight(1.5);
  cloudLayer.stroke(255, 255, 255, 180);
  for (let i = 0; i < 5; i++) {
    const x = centerX + rnd(-widthPx / 4, widthPx / 4);
    const y = centerY + rnd(-heightPx / 7, heightPx / 7);
    const size = rnd(minSide / 5, minSide / 3);
    cloudLayer.rect(x, y, size, size);
  }
}

// Molnar Square function adepted from a tutorial by Kevin Workman
// "Vera Molnár Squares p5.js Coding Challenge"
// Link - https://www.youtube.com/watch?v=eykSzznPimQ&t=4431s
function drawMolnarSquareOnLayer(cloudLayer, x, y, size, col) {
  const layers = 20;
  const variance = size / 20;
  cloudLayer.noFill();
  cloudLayer.stroke(col);
  cloudLayer.strokeWeight(1);

  for (let i = 0; i < layers; i++) {
    if (random() > 0.7) continue;

    let s = (size / layers) * i;
    let half = s / 2;

    cloudLayer.beginShape();
    cloudLayer.vertex(
      getRandomValue(x - half, variance),
      getRandomValue(y - half, variance)
    );
    cloudLayer.vertex(
      getRandomValue(x + half, variance),
      getRandomValue(y - half, variance)
    );
    cloudLayer.vertex(
      getRandomValue(x + half, variance),
      getRandomValue(y + half, variance)
    );
    cloudLayer.vertex(
      getRandomValue(x - half, variance),
      getRandomValue(y + half, variance)
    );
    cloudLayer.endShape(CLOSE);
  }
}

function getRandomValue(pos, variance) {
  return pos + map(random(4), 0, 4, -variance, variance);
}
