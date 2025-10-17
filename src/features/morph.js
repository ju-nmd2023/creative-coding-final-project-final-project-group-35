import { video } from "../project.js";

let tRaw = 0;
let tSmooth = 0;
let yoff = 0;

let hands = [];
let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;
let handDetected = false;

export async function setupMorph() {
  currentX = 0;
  currentY = 0;
}

export function gotHands(results) {
  hands = results;
}

export function drawMorph(scrollY) {
  const maxScroll = 3328;
  const s = maxScroll > 1 ? scrollY / maxScroll : 0;
  tRaw = constrain(s, 0, 1);

  const alpha = 0.08;
  tSmooth += alpha * (tRaw - tSmooth);

  updateHandFollow();

  push();
  translate(width / 2 + currentX, height / 2 + currentY);

  const k =
    tSmooth < 0.5
      ? 2 * tSmooth * tSmooth
      : 1 - Math.pow(-2 * tSmooth + 2, 2) / 2;

  drawThreeStageMorph(k);

  yoff += 0.005;
  pop();
}

function updateHandFollow() {
  handDetected = false;

  if (hands.length > 0) {
    const hand = hands[0];

    if (hand.keypoints && hand.keypoints[8]) {
      const indexTip = hand.keypoints[8];
      handDetected = true;

      // Map video coordinates to canvas coordinates
      targetX = map(indexTip.x, 0, video.width, width / 2, -width / 2);
      targetY = map(indexTip.y, 0, video.height, -height / 2, height / 2);
    }
  }

  const followSpeed = handDetected ? 0.15 : 0.05;
  currentX += (targetX - currentX) * followSpeed;
  currentY += (targetY - currentY) * followSpeed;
}

// Draw morphing shape that transitions from circle to crescent moon to
// butterfly achieved with the help of perplexity
// Link - https://www.perplexity.ai/search/create-a-p5js-project-that-1-t-Us0g3jttQd2NJv0Q7tBQNQ#3
function drawThreeStageMorph(k) {
  const steps = 600;

  const circlePts = generateCircle(steps);
  const moonPts = generateCrescentMoon(steps);
  const butterflyPts = generateButterfly(steps);

  let morphPts;

  if (k < 0.33) {
    const localK = map(k, 0, 0.33, 0, 1);
    morphPts = lerpShapes(circlePts, moonPts, localK);
  } else if (k < 0.66) {
    morphPts = moonPts;
  } else {
    const localK = map(k, 0.66, 1, 0, 1);
    morphPts = lerpShapes(moonPts, butterflyPts, localK);
  }

  const strokeAlpha = map(k, 0, 1, 100, 255);
  stroke(255, 255, 255, strokeAlpha);
  strokeWeight(1);
  noFill();
  beginShape();
  for (const point of morphPts) vertex(point.x, point.y);
  endShape(CLOSE);

  const fillAlpha = map(k, 0.5, 1, 0, 50);
  if (fillAlpha > 1) {
    fill(245, 245, 245, fillAlpha);
    beginShape();
    for (const point of morphPts) vertex(point.x, point.y);
    endShape(CLOSE);
  }
}

function generateCircle(steps) {
  const pts = [];
  const circleR = 2.5;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * TWO_PI;
    pts.push({
      x: circleR * Math.cos(a),
      y: circleR * Math.sin(a),
    });
  }
  return pts;
}

function generateCrescentMoon(steps) {
  const pts = [];
  const moonRadius = 100;
  const offset = 25;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let x, y;

    if (t <= 0.5) {
      const a = map(t, 0, 0.5, -HALF_PI, HALF_PI);
      x = moonRadius * Math.cos(a);
      y = moonRadius * Math.sin(a);
    } else {
      const a = map(t, 0.5, 1, HALF_PI, -HALF_PI);
      x = offset + moonRadius * Math.cos(a);
      y = moonRadius * Math.sin(a);
    }

    const craterNoise = getCraterDistortion(x, y);
    pts.push({
      x: x + craterNoise.x,
      y: y + craterNoise.y,
    });
  }
  return pts;
}

function getCraterDistortion(x, y) {
  const angle = Math.atan2(y, x);
  const distortion = Math.sin(angle * 8) * 3 + Math.cos(angle * 5) * 2;

  return {
    x: Math.cos(angle) * distortion * 0.5,
    y: Math.sin(angle) * distortion * 0.5,
  };
}

// Butterfly inspired by zainaiqbal
// Link - https://editor.p5js.org/zainaiqbal/sketches/05aQJX0vt
function generateButterfly(steps) {
  const pts = [];
  const da = TWO_PI / steps;
  const dx = 0.025;
  let xoff = 0;

  const flap = Math.sin(frameCount * 0.006);
  const butterflyScale = 0.4;

  for (let i = 0; i <= steps; i++) {
    const a = i * da;
    const n = noise(xoff, yoff);
    const r = Math.sin(2 * a) * map(n, 0, 1, 50, 300) * butterflyScale;
    const x = flap * r * Math.cos(a);
    const y = r * Math.sin(a);
    if (a < Math.PI) xoff += dx;
    else xoff -= dx;
    pts.push({ x, y });
  }

  return pts;
}

// Linear interpolation helper function between two shapes achived
// with the help of perplexity
// Link - https://www.perplexity.ai/search/create-a-p5js-project-that-1-t-Us0g3jttQd2NJv0Q7tBQNQ#3
function lerpShapes(shape1, shape2, k) {
  const morphed = [];
  for (let i = 0; i < shape1.length; i++) {
    morphed.push({
      x: lerp1(shape1[i].x, shape2[i].x, k),
      y: lerp1(shape1[i].y, shape2[i].y, k),
    });
  }
  return morphed;
}

function lerp1(a, b, k) {
  return a + (b - a) * k;
}
