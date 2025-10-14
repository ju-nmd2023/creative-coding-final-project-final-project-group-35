import {
  yScroll,
  maxYScroll,
  hScroll,
  maxHScroll,
  squares,
} from "../project.js";

export function setupSky() {
  const minSize = 16,
    maxSize = 50,
    density = 0.006;
  const totalSquares = int(width * (height + maxYScroll) * density);
  squares.length = 0;
  for (let i = 0; i < totalSquares; i++) {
    const size = random(minSize, maxSize);
    const x = random(-size / 2, width + maxHScroll - size / 2);
    const y = random(-size / 2, height + maxYScroll - size / 2);
    const r = random(18, 32),
      g = random(30, 54),
      b = random(80, 140);
    const alpha = random(140, 210),
      cornerRadius = random(2, 7);
    squares.push({ x, y, size, col: [r, g, b, alpha], cornerRadius });
  }
}

export function drawSky() {
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
