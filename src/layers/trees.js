import { maxYScroll, maxXScroll, time } from "../project.js";

let treeData = [];

function getFieldSurfaceY(x, i = layerIndex) {
  const yoff =
    (i + 1) * 75 + (30 + i * 5) * sin(x * (0.002 + 0.0005 * i) + i * 1.5);
  const baseH = height + maxYScroll - 120;
  return baseH - i * 100 + yoff;
}

export function setupTrees() {
  treeData = [];

  const treeCounts = [5, 3, 2, 1];

  for (let layer = 0; layer < 4; layer++) {
    const numTrees = treeCounts[layer];
    const sectionWidth = (width + maxXScroll) / numTrees;

    for (let i = 0; i < numTrees; i++) {
      const x =
        i * sectionWidth + random(sectionWidth * 0.2, sectionWidth * 0.8);

      treeData.push({
        x,
        y: getFieldSurfaceY(x, layer),
        layer,
        scale: 1.0 - layer * 0.15,
        amp1: random(14, 34),
        freq1: random(0.6, 2.3),
        phase1: random(TWO_PI),
        amp2: random(3, 12),
        freq2: random(1.5, 4.7),
        phase2: random(TWO_PI),
        colorSeed: random(1000),
      });
    }
  }

  treeData.sort((a, b) => b.layer - a.layer);
}

export function drawTrees() {
  for (let tree of treeData) {
    drawTree(
      tree.x,
      tree.y,
      tree.scale,
      tree.amp1,
      tree.freq1,
      tree.phase1,
      tree.amp2,
      tree.freq2,
      tree.phase2,
      tree.colorSeed
    );
  }
}

function drawTree(
  posX,
  posY,
  treeScale,
  amp1,
  freq1,
  phase1,
  amp2,
  freq2,
  phase2,
  colorSeed
) {
  push();
  translate(posX, posY);
  scale(treeScale);

  const trunkSegments = 45;

  // Trunk part of the tree adepted from perplexity
  // Link - https://www.perplexity.ai/search/this-is-my-code-for-the-trunk-DgeMvpokTBialE2MzGcxXA#1
  const leftParts = [];
  const rightParts = [];
  for (let i = 0; i <= trunkSegments; i++) {
    const t = i / trunkSegments;
    const y = lerp(0, -300, t);
    const xCurve =
      0 +
      sin(t * PI * freq1 + phase1) * amp1 +
      sin(t * PI * freq2 + phase2) * amp2;
    const trunkWidth = lerp(38, 8, t);

    leftParts.push({ x: xCurve - trunkWidth / 2, y: y });
    rightParts.push({ x: xCurve + trunkWidth / 2, y: y });
  }

  fill(80);
  noStroke();
  beginShape();
  for (let part of leftParts) vertex(part.x, part.y);
  for (let i = rightParts.length - 1; i >= 0; i--)
    vertex(rightParts[i].x, rightParts[i].y);
  endShape(CLOSE);

  const topCenterX =
    (leftParts[trunkSegments].x + rightParts[trunkSegments].x) / 2;
  const topCenterY =
    (leftParts[trunkSegments].y + rightParts[trunkSegments].y) / 2;

  const originalCenters = [
    { x: 0, y: -160, r: 55 },
    { x: 55, y: -205, r: 38 },
    { x: 90, y: -140, r: 44 },
    { x: 45, y: -120, r: 44 },
    { x: -5, y: -110, r: 36 },
  ];

  const offsetX =
    topCenterX -
    originalCenters.reduce((sum, foliage) => sum + foliage.x, 0) /
      originalCenters.length;
  const offsetY =
    topCenterY -
    originalCenters.reduce((sum, foliage) => sum + foliage.y, 0) /
      originalCenters.length;

  const foliageCenters = originalCenters.map((foliage) => ({
    x: foliage.x + offsetX,
    y: foliage.y + offsetY,
    r: foliage.r,
  }));

  noStroke();

  // Pre-generate random values using the seed;
  // otherwise interferes with global random state (e.g., falling star positions)
  // This fix was achieved with the help of perplexity after commit 641a556
  // Link - https://www.perplexity.ai/search/when-i-drawtrees-function-in-t-3JJI__BqTUSk7j4PCF0sZg
  randomSeed(colorSeed);

  for (const fc of foliageCenters) {
    for (let j = 0; j < 18; j++) {
      const ang = random(TWO_PI);
      const rad = random(fc.r * 0.7, fc.r);
      const fx = fc.x + cos(ang) * rad;
      const fy = fc.y + sin(ang) * rad;

      push();
      translate(
        map(noise(fx * 0.01, fy * 0.01, time), 0, 1, -18, 18),
        map(noise(fx * 0.01 + 100, fy * 0.01 + 100, time), 0, 1, -10, 10)
      );
      fill(random(90, 150), random(45, 80), random(90, 150), 120 + random(70));
      ellipse(fx, fy, random(24, 34), random(23, 31));
      pop();
    }

    fill(random(60, 80), random(30, 50), random(60, 80), 160 + random(35));
    ellipse(fc.x, fc.y, fc.r * 1.1, fc.r * 1.03);
  }

  randomSeed(millis());

  pop();
}
