let synth;
let melody;
let lpf;
let audioStarted = false;
let doubleTime = false;



function setup() {
  createCanvas(400, 400);
  Tone.Transport.bpm.value = 100; 
  
  // list with notes to pull from
  const notes = ["C2","C3","C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];

  // set up low pass filter
  lpf = new Tone.Filter({
    frequency: 1000,
    type: "lowpass"
  }).toDestination();
  
  // create synth instance
  synth = new Tone.Synth({
      oscillator: { type: "sine" }
    }).connect(lpf);

  // create a "tone loop" from a random sequence of notes
  // play the tone loop with duration 16n and interval 8n
  melody = new Tone.Loop((time) => {
    let randomNote = random(notes);
    synth.triggerAttackRelease(randomNote, "16n", time);
  }, "8n");
}



function draw() {
  // create background sections
  noStroke();

  fill(41, 128, 185);
  rect(0, 0, 100, height);
  
  fill("gold");
  rect(100, 0, 100, height);
  
  fill("lightseagreen");
  rect(200, 0, 100, height);
  
  fill("cornflowerblue");
  rect(300, 0, 100, height);

  fill("black")
  triangle(mouseX +5, mouseY - 5 , mouseX - 5, mouseY + 5, mouseX - 10 , mouseY -10)

  // change waveform by which quadrant the mouse is in
  if (mouseX < 100) {
    synth.oscillator.type = "sine";
  } else if (mouseX < 200) {
    synth.oscillator.type = "triangle";
  } else if (mouseX < 300) {
    synth.oscillator.type = "square";
  } else {
    synth.oscillator.type = "sawtooth";
  }

  // map cutoff freq to mouse y coord
  let cutoffFreq = map(mouseY, height, 0, 100, 8000);
  lpf.frequency.value = cutoffFreq;
  
  // intro
  if (!audioStarted) {
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(14);
    text("Click anywhere on the canvas to start audio", width / 2, height - 30);
  }  
}
// start audio
function mousePressed() {
  if (!audioStarted) {
    Tone.start();
    Tone.Transport.start();
    melody.start(0);
    audioStarted = true;
  }
}
// make the notes go twice as fast
function doubleClicked() {
  if (!doubleTime) {
    melody.interval = "16n";
    doubleTime = true;
  }
  // return to single time
  else {
    melody.interval = "8n";
    doubleTime = false;
  }
  
  
}



