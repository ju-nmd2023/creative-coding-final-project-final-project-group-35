import { maxYScroll } from "../project.js";

export function drawMountain() {
  const baseY = height + maxYScroll - 1000;
  const w = 800;
  noStroke();

  fill(30, 50, 100);
  beginShape();
  vertex(0, baseY + 550);
  vertex(w * 0.1, baseY + 320);
  vertex(w * 0.25, baseY + 420);
  vertex(w * 0.4, baseY + 180);
  vertex(w * 0.5, baseY + 310);
  vertex(w * 0.6, baseY + 230);
  vertex(w * 0.75, baseY + 400);
  vertex(w * 0.79, baseY + 350);
  vertex(w * 1.8, baseY + 1500);
  vertex(w, height + maxYScroll);
  vertex(0, height + maxYScroll);
  endShape(CLOSE);

  fill(40, 70, 130);
  beginShape();
  vertex(0, baseY + 650);
  vertex(w * 0.08, baseY + 470);
  vertex(w * 0.22, baseY + 560);
  vertex(w * 0.35, baseY + 400);
  vertex(w * 0.5, baseY + 520);
  vertex(w * 0.58, baseY + 360);
  vertex(w * 0.8, baseY + 570);
  vertex(w * 0.8, baseY + 510);
  vertex(w * 1.7, baseY + 1500);
  vertex(w, height + maxYScroll);
  vertex(0, height + maxYScroll);
  endShape(CLOSE);

  fill(60, 100, 170);
  beginShape();
  vertex(0, baseY + 720);
  vertex(w * 0.12, baseY + 670);
  vertex(w * 0.28, baseY + 720);
  vertex(w * 0.45, baseY + 560);
  vertex(w * 0.55, baseY + 660);
  vertex(w * 0.65, baseY + 560);
  vertex(w * 0.85, baseY + 700);
  vertex(w * 0.87, baseY + 670);
  vertex(w * 1.6, baseY + 1500);
  vertex(w, height + maxYScroll);
  vertex(0, height + maxYScroll);
  endShape(CLOSE);

  fill(90, 140, 210);
  beginShape();
  vertex(0, baseY + 780);
  vertex(w * 0.15, baseY + 740);
  vertex(w * 0.3, baseY + 800);
  vertex(w * 0.5, baseY + 700);
  vertex(w * 0.6, baseY + 790);
  vertex(w * 0.73, baseY + 720);
  vertex(w * 1.4, baseY + 1500);
  vertex(w, height + maxYScroll);
  vertex(0, height + maxYScroll);
  endShape(CLOSE);
}
