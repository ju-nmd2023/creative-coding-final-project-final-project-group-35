let spaceSoundPlayer;
let cloudsSoundPlayer;
let groundSoundPlayer;

let audioInitialized = false;

const spaceRange = { start: -200, end: 800 };
const cloudsRange = { start: 600, end: 3400 };
const groundRange = { start: 3000, end: 5000 };

export async function setupAudio() {
  spaceSoundPlayer = new Tone.Player({
    url: "./src/assets/space_sound.mp3",
    loop: true,
    volume: -Infinity,
  }).toDestination();

  cloudsSoundPlayer = new Tone.Player({
    url: "./src/assets/clouds_sound.mp3",
    loop: true,
    volume: -Infinity,
  }).toDestination();

  groundSoundPlayer = new Tone.Player({
    url: "./src/assets/ground_sound.mp3",
    loop: true,
    volume: -Infinity,
  }).toDestination();
  await Tone.loaded();
}

export async function startAudio() {
  if (!audioInitialized) {
    await Tone.start();
    spaceSoundPlayer.start();
    cloudsSoundPlayer.start();
    groundSoundPlayer.start();
    audioInitialized = true;
  }
}

// Update audio layers based on current yScroll position adepted from perplexity
// Link - https://www.perplexity.ai/search/in-my-p5js-project-using-a-ton-s2GPN3zlTJmozaAnNWx8UQ?0=d#2
export function updateAudioLayers(currentY) {
  if (!audioInitialized) return;

  const spaceVolume = constrain(
    map(currentY, spaceRange.start, spaceRange.end, 1, 0),
    0,
    1
  );
  const cloudsVolume =
    constrain(map(currentY, cloudsRange.start, cloudsRange.end, 0, 1), 0, 1) *
    constrain(map(currentY, cloudsRange.start, cloudsRange.end, 1, 0), 0, 1);
  const groundVolume = constrain(
    map(currentY, groundRange.start, groundRange.end, 0, 1),
    0,
    1
  );

  spaceSoundPlayer.volume.value = Tone.gainToDb(Math.max(spaceVolume, 0.0001));
  cloudsSoundPlayer.volume.value = Tone.gainToDb(
    Math.max(cloudsVolume, 0.0001)
  );
  groundSoundPlayer.volume.value = Tone.gainToDb(
    Math.max(groundVolume, 0.0001)
  );
}
