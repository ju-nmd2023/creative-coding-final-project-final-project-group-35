export let starLayer;
export let stars = [];
const starCount = 100;

export function setupStars() {
  starLayer = createGraphics(width, height);
  initializeStars();
  drawStarsLayer();
}

function initializeStars() {
  stars = Array.from({ length: starCount }, () => ({
    x: random(width),
    y: random() * random() * height,
    r: random(0.6, 2.0),
    base: random(180, 255),
  }));
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
