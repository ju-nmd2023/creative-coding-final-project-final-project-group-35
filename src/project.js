import { drawFields } from "./layers/fields.js";
import { drawMountain } from "./layers/mountains.js";
import { drawSky } from "./layers/sky.js";
import { setupClouds, cloudLayer } from "./layers/clouds.js";
import { setupSky } from "./layers/sky.js";
import {
  setupStars,
  starLayer,
  drawStarsLayer,
  isStarsInView,
} from "./layers/stars.js";
import { setupAudio, startAudio, updateAudioLayers } from "./features/audio.js";
import { setupTrees, drawTrees } from "./layers/trees.js";
import { setupMorph, drawMorph, gotHands } from "./features/morph.js";

export let yScroll = 0;
export let maxYScroll = 3328;
export let xScroll = 0;
export let maxXScroll = 2560;

export let squares = [];
export let stars = [];
export let clouds = [];

export let handPose;
export let video;
window.preload = function () {
  handPose = ml5.handPose();
};

window.setup = async function () {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  background(20, 30, 60);

  setupSky();
  setupStars();
  setupClouds();
  setupTrees();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);
  await setupMorph(handPose);
  await setupAudio();
};

window.mousePressed = async function () {
  await startAudio();

  if (Tone.context.state !== "running") {
    await Tone.context.resume();
  }
};

window.draw = function () {
  background(20, 30, 60);

  const now = millis();
  drawStarsLayer(now);

  push();
  if (yScroll < maxYScroll) {
    translate(0, -yScroll);
    drawSky();
    drawGround();
    let cloudYOffset = yScroll - 1200;
    if (cloudYOffset < 0) cloudYOffset = 0;
    image(cloudLayer, 0, -cloudYOffset);
  } else {
    translate(-xScroll, -maxYScroll);
    drawSky();
    drawGround();
    image(cloudLayer, -xScroll, -(maxYScroll - 1200));
  }
  if (isStarsInView()) {
    image(starLayer, 0, 0);
  }

  pop();

  drawMorph(yScroll);
  updateAudioLayers(yScroll);
};

function drawGround() {
  drawMountain();
  drawFields();
  drawTrees();
}

window.mouseWheel = function (event) {
  if (yScroll < maxYScroll) {
    yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
  } else {
    if (event.deltaY > 0 || xScroll > 0) {
      xScroll = constrain(xScroll + event.deltaY, 0, maxXScroll);
      if (xScroll <= 0 && event.deltaY < 0) {
        yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
        xScroll = 0;
      }
    } else {
      yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
    }
  }
  return false;
};
