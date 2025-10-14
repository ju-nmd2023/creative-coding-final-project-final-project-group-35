import { drawFields } from "./layers/fields.js";
import { drawMountain } from "./layers/mountains.js";
import { drawSky } from "./layers/sky.js";
import { setupClouds, cloudLayer } from "./layers/clouds.js";
import { setupSky } from "./layers/sky.js";
import { setupStars, starLayer } from "./layers/stars.js";

export let yScroll = 0;
export let maxYScroll = 3328;
export let hScroll = 0;
export let maxHScroll = 2560;

export let squares = [];
export let stars = [];
export let clouds = [];

window.setup = function () {
  createCanvas(innerWidth, innerHeight);
  noStroke();
  background(20, 30, 60);

  setupSky();
  setupStars();
  setupClouds();
};

window.draw = function () {
  background(20, 30, 60);

  push();
  if (yScroll < maxYScroll) {
    translate(0, -yScroll);
    drawSky();
    drawGround();
    let cloudYOffset = yScroll - 1200;
    if (cloudYOffset < 0) cloudYOffset = 0;
    image(cloudLayer, 0, -cloudYOffset);
  } else {
    translate(-hScroll, -maxYScroll);
    drawSky();
    drawGround();
    image(cloudLayer, -hScroll, -(maxYScroll - 1200));
  }
  image(starLayer, 0, 0);
  pop();
};

function drawGround() {
  drawMountain();
  drawFields();
}

window.mouseWheel = function (event) {
  if (yScroll < maxYScroll) {
    yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
  } else {
    if (event.deltaY > 0 || hScroll > 0) {
      hScroll = constrain(hScroll + event.deltaY, 0, maxHScroll);
      if (hScroll <= 0 && event.deltaY < 0) {
        yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
        hScroll = 0;
      }
    } else {
      yScroll = constrain(yScroll + event.deltaY, 0, maxYScroll);
    }
  }
  return false;
};
