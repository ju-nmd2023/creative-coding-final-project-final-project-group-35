import { maxYScroll, maxXScroll } from "../project.js";

export let cloudLayer;
export let clouds = [];

export function setupClouds() {
  // The use of createGraphics function was provided by perplexity, referencing p5js documentation.
  // Link - https://www.perplexity.ai/search/i-m-working-on-a-project-using-mnRYqlI4Rg2g.NlV_rvFZA#0
  cloudLayer = createGraphics(width + maxYScroll * 2, height + maxYScroll * 2);

  const baseY = height + maxYScroll + 1500;
  const cloudStartY = baseY - 600;
  const cloudEndY = baseY;
  clouds.length = 0;
  for (let i = 0; i < 120; i++) {
    const cloudWidth = random(180, 320);
    clouds.push({
      x: random(0, width + maxXScroll + 2400),
      y: random(cloudStartY, cloudEndY),
      cloudWidth,
      cloudHeight: random(80, cloudWidth / 2),
    });
  }
  setupCloudsLayer();
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
