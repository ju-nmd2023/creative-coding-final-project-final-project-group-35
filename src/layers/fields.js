import { maxYScroll, maxXScroll } from "../project.js";

export function drawFields() {
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
    for (let x = 0; x <= width + maxXScroll; x += 15) {
      const yoff =
        (i + 1) * 75 + (30 + i * 5) * sin(x * (0.002 + 0.0005 * i) + i * 1.5);
      const y = baseH - i * 100 + yoff;
      vertex(x, y);
    }
    vertex(width + maxXScroll, baseH + 220 + i * 20);
    endShape(CLOSE);
  }
  pop();
}
