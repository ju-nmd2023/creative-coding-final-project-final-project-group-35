import { maxXScroll, maxYScroll } from "../project.js";

let windParticles = [];

export function setupWindParticles() {
  windParticles = [];

  for (let i = 0; i < 300; i++) {
    randomSeed(millis() + i * 1000);

    windParticles.push({
      pos: createVector(
        random(-500, width + maxXScroll),
        random(height + maxYScroll - height, height + maxYScroll)
      ),
      vel: createVector(0, 0),
      acc: createVector(0, 0),
      maxSpeed: random(3, 6),
      alpha: random(100, 220),
      size: random(2, 8),
      uniqueSeed: millis() + i * 1000,
    });
  }

  randomSeed(millis());
}

// Function for drawing the wind particles inspired by ada10086
// Link - https://editor.p5js.org/ada10086/sketches/r1gmVaE07
export function drawWindParticles(viewX, viewY) {
  const flowFieldScale = 30;

  push();
  noStroke();

  for (let p of windParticles) {
    const xOff = p.pos.x / flowFieldScale;
    const yOff = (p.pos.y - (height + maxYScroll - height)) / flowFieldScale;
    const angle = noise(xOff, yOff, frameCount * 0.003) * TWO_PI * 4;

    const flowForce = p5.Vector.fromAngle(angle);
    flowForce.mult(0.5);

    p.acc.add(flowForce);
    p.acc.add(createVector(2.5, 0));

    p.vel.add(p.acc);
    p.vel.limit(p.maxSpeed);
    p.pos.add(p.vel);
    p.acc.mult(0);

    if (p.pos.y < height + maxYScroll - height) {
      p.pos.y = height + maxYScroll - height;
      p.vel.y *= -0.5;
    }
    if (p.pos.y > height + maxYScroll) {
      p.pos.y = height + maxYScroll;
      p.vel.y *= -0.5;
    }

    if (p.pos.x > width + maxXScroll + 100) {
      randomSeed(p.uniqueSeed + frameCount);
      p.pos.x = random(-800, -100);
      p.pos.y = random(height + maxYScroll - height, height + maxYScroll);
      p.vel = createVector(random(0, 2), random(-0.5, 0.5));
      p.maxSpeed = random(3, 6);
      p.alpha = random(100, 220);
      p.size = random(2, 8);
      p.uniqueSeed = millis() + frameCount;
      randomSeed(millis());
    }

    if (
      p.pos.x > viewX - 150 &&
      p.pos.x < viewX + width + 150 &&
      p.pos.y > viewY - 100 &&
      p.pos.y < viewY + height + 100
    ) {
      fill(220, 230, 255, p.alpha);
      ellipse(p.pos.x, p.pos.y, p.size, p.size * 0.5);

      fill(200, 220, 240, p.alpha * 0.4);
      ellipse(p.pos.x - 15, p.pos.y, p.size * 0.8, p.size * 0.4);

      fill(180, 210, 230, p.alpha * 0.2);
      ellipse(p.pos.x - 25, p.pos.y, p.size * 0.6, p.size * 0.3);
    }
  }
  pop();
}
