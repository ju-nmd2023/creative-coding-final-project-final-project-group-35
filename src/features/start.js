import { video } from "../project.js";

export default function drawStartScreen() {
  push();
  const videoW = 320;
  const videoH = 240;
  const videoX = (width - videoW) / 2;
  const videoY = height / 2 - videoH / 2 - 80;

  stroke(0, 0, 119);
  strokeWeight(3);
  fill(0);
  rect(videoX - 5, videoY - 5, videoW + 10, videoH + 10);
  noStroke();

  translate(videoX + videoW, videoY);
  scale(-1, 1);
  image(video, 0, 0, videoW, videoH);
  pop();

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Interactive Painting", width / 2, height / 6);
  pop();

  push();
  fill(200, 220, 255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text(
    "Scroll to explore the scene and use your hand to interact",
    width / 2,
    videoY + videoH + 40
  );

  textSize(18);
  text(
    "📷 Camera permission required    🔊 Sound enabled",
    width / 2,
    videoY + videoH + 70
  );
  pop();

  push();
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  text("Click to begin", width / 2, height - 150);
  pop();
}
