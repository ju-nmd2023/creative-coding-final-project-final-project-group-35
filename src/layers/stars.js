import { yScroll, maxYScroll } from "../project.js";

export let starLayer;
export let shootingStarLayer;
export let stars = [];
let shootingStars = [];
let perlinT = 0;
let lastShootTime = 0;
let nextShootIn = 350;
let cachedVisibility = false;
let frameCounter = 0;

export function setupStars() {
  starLayer = createGraphics(width, height);
  shootingStarLayer = createGraphics(width, height);
  initializeStars();
  renderStars();
}

// Glowing star logic adpeted from perplexity
// Link - https://www.perplexity.ai/search/i-m-working-on-a-p5js-project-oPp2gsb9QYCPPUMrNgfWPg#2
function initializeStars() {
  stars = Array.from({ length: 70 }, () => {
    const y = random() * random() * height;
    const base = random(180, 255);
    return {
      x: random(width),
      y,
      r: random(0.6, 2.0),
      base,
      phase: random(TWO_PI),
      speed: random(0.05, 0.2),
      twinkleAmp: random(2.25, 2.4),
    };
  });
}

// Shooting star logic adpeted from perplexity
// Link - https://www.perplexity.ai/search/i-m-working-on-a-p5js-project-oPp2gsb9QYCPPUMrNgfWPg#2
function spawnShootingStar(now) {
  const speed = random(7, 12);
  const angle = radians(random(20, 35));
  const vx = speed * cos(angle);
  const vy = speed * sin(angle);

  shootingStars.push({
    x: random(-width * 0.2, width * 0.6),
    y: random(-height * 0.1, height * 0.35),
    vx,
    vy,
    invSpeed: 1 / speed,
    life: random(420, 700),
    born: now,
    len: random(60, 120),
    thickness: random(1.2, 2.2),
  });
}

function updateVisibility() {
  const viewTop = constrain(yScroll, 0, maxYScroll);

  return !(height < viewTop - 100 || 0 > viewTop + windowHeight + 100);
}

export function drawStarsLayer(now) {
  cachedVisibility = updateVisibility();
  if (!cachedVisibility) return;

  frameCounter++;
  perlinT += 0.003;

  if (frameCounter % 6 === 0) {
    renderStars();
  }

  shootingStarLayer.clear();
  updateShootingStarSpawner(now);
  renderShootingStars(now);
}

function renderStars() {
  const ctx = starLayer.drawingContext;
  starLayer.clear();
  starLayer.noStroke();

  ctx.shadowColor = "rgba(255,255,255,0.7)";

  for (let i = 0; i < stars.length; i++) {
    const star = stars[i];

    const yp = constrain(star.y / height, 0, 1);
    const fade = 1.0 - yp * 0.8;

    star.phase += star.speed * 6;
    const n = noise(star.x * 0.003, star.y * 0.003, perlinT);
    const twinkle = sin(star.phase) * star.twinkleAmp * (0.6 + 0.4 * n);

    const gray = star.base * fade;
    const alphaBase = 180 + 60 * (0.5 + 0.5 * twinkle);
    const sizePulse = 1.0 + 0.4 * (0.5 + 0.5 * twinkle);

    ctx.shadowBlur = 10 + 6 * (0.5 + 0.5 * twinkle);

    ctx.shadowBlur = 14 + 10 * (0.5 + 0.5 * twinkle);
    ctx.shadowColor = "rgba(255,255,255,0.8)";
    starLayer.fill(gray, gray, gray, alphaBase);
    starLayer.circle(star.x, star.y, star.r * 2 * sizePulse);
    starLayer.pop();
  }
}

function updateShootingStarSpawner(now) {
  if (!cachedVisibility) return;
  if (now - lastShootTime > nextShootIn) {
    spawnShootingStar(now);
    lastShootTime = now;
    nextShootIn = random(350, 900);
  }
}

function renderShootingStars(now) {
  const ctx = shootingStarLayer.drawingContext;
  shootingStarLayer.push();
  ctx.globalCompositeOperation = "source-over";

  for (let i = shootingStars.length - 1; i >= 0; i--) {
    const s = shootingStars[i];
    const age = now - s.born;
    const t = constrain(age / s.life, 0, 1);

    s.x += s.vx;
    s.y += s.vy;

    const fade = sin(PI * t);

    const ux = s.vx * s.invSpeed;
    const uy = s.vy * s.invSpeed;

    const trailScale = s.len * (0.6 + 0.4 * fade);
    const trailDX = -ux * trailScale;
    const trailDY = -uy * trailScale;

    const aHead = 220 * fade;
    const rHead = 255,
      gHead = 255,
      bHead = 255;
    const rTail = 180,
      gTail = 210,
      bTail = 255;
    const aTail = aHead * 0.05;

    shootingStarLayer.noFill();
    shootingStarLayer.strokeWeight(s.thickness);

    for (let j = 0; j < 6; j++) {
      const u1 = j / 6;
      const u2 = (j + 1) / 6;

      const x1 = s.x + trailDX * u1;
      const y1 = s.y + trailDY * u1;
      const x2 = s.x + trailDX * u2;
      const y2 = s.y + trailDY * u2;

      const rr = rHead + (rTail - rHead) * u1;
      const gg = gHead + (gTail - gHead) * u1;
      const bb = bHead + (bTail - bHead) * u1;
      const aa = aHead + (aTail - aHead) * u1;

      shootingStarLayer.stroke(rr, gg, bb, aa);
      shootingStarLayer.line(x1, y1, x2, y2);
    }

    shootingStarLayer.noStroke();
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(255,255,255,0.7)";
    shootingStarLayer.fill(255, 255, 255, aHead);
    shootingStarLayer.circle(s.x, s.y, 3 + 2.5 * fade);

    if (age >= s.life || s.x > width + s.len || s.y > height + s.len) {
      shootingStars.splice(i, 1);
    }
  }

  shootingStarLayer.pop();
}

export function isStarsInView() {
  const layerTop = 0;
  const layerBottom = height;
  const viewTop = constrain(yScroll, 0, maxYScroll);
  const viewBottom = viewTop + windowHeight;
  return !(layerBottom < viewTop - 100 || layerTop > viewBottom + 100);
}
