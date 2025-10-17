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
  shootingStarLayer,
} from "./layers/stars.js";
import { setupAudio, startAudio, updateAudioLayers } from "./features/audio.js";
import { setupTrees, drawTrees } from "./layers/trees.js";
import { setupMorph, drawMorph, gotHands } from "./features/morph.js";
import drawStartScreen from "./features/start.js";

export let yScroll = 0;
export let maxYScroll = 3328;
export let xScroll = 0;
export let maxXScroll = 2560;
export let time = 0;

export let squares = [];
export let stars = [];
export let clouds = [];

export let handPose;
export let video;

let lenis;
let gameStarted = false;

window.preload = function () {
  handPose = ml5.handPose();
};

window.setup = async function () {
  createCanvas(windowWidth, windowHeight);
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

  // Initialize Lenis (smooth scrolling)
  // Documentation - https://github.com/darkroomengineering/lenis
  lenis = new Lenis({
    lerp: 0.1,
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 1,
  });

  lenis.on("scroll", (e) => {
    if (!gameStarted) return;

    const totalScroll = e.animatedScroll;

    if (totalScroll < maxYScroll) {
      yScroll = totalScroll;
      xScroll = 0;
    } else {
      yScroll = maxYScroll;
      xScroll = Math.min(totalScroll - maxYScroll, maxXScroll);
    }
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
};

window.mousePressed = async function () {
  if (!gameStarted) {
    gameStarted = true;
    await startAudio();

    if (Tone.context.state !== "running") {
      await Tone.context.resume();
    }
    return;
  }

  await startAudio();

  if (Tone.context.state !== "running") {
    await Tone.context.resume();
  }
};

window.draw = function () {
  background(20, 30, 60);
  time += 0.01;

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
    image(shootingStarLayer, 0, 0);
  }

  pop();

  drawMorph(yScroll);
  updateAudioLayers(yScroll);

  if (!gameStarted) {
    drawStartScreen();
  }
};

function drawGround() {
  drawMountain();
  drawFields();
  drawTrees();
}

window.windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};
