let sketcyhy;
let audioStarted = false;
let transportStarted = false;

Tone.Transport.bpm.value = 100;

const majorNotes = ["C2", "C3", "C4", "D4", "E4", "G4", "A4", "C5", "D5", "E5", "G5", "A5"];
const minorNotes = ["C2", "C3", "C4", "D4", "Eb4", "G4", "Ab4", "C5", "D5", "Eb5", "G5", "Ab5"];
const majorColors = ["rgb(41, 128, 185)", "gold", "lightseagreen", "cornflowerblue"];
const minorColors = ["red", "purple", "orange", "brown"];

function createMusicSketch(notes, colors, containerId) {
  return function(p) {
    let synth;
    let melody;
    let lpf;
    let doubleTime = false;
    let isPlaying = false;
    let startStopButton;
    let cursorX;
    let cursorY;

    p.setup = function() {
      const canvas = p.createCanvas(400, 400);
      canvas.parent(containerId);
      cursorX = p.width / 2;
      cursorY = p.height / 2;

      const controls = p.createDiv();
      controls.parent(containerId);
      controls.style("width", `${p.width}px`);
      controls.style("margin-top", "10px");
      controls.style("text-align", "center");

      startStopButton = p.createButton("Start");
      startStopButton.parent(controls);
      startStopButton.style("background-color", "#2e9d45");
      startStopButton.style("color", "white");
      startStopButton.style("border", "none");
      startStopButton.style("padding", "8px 16px");
      startStopButton.style("cursor", "pointer");
      startStopButton.mousePressed(togglePlayback);

      lpf = new Tone.Filter({
        frequency: 1000,
        type: "lowpass"
      }).toDestination();

      synth = new Tone.Synth({
        oscillator: { type: "sine" }
      }).connect(lpf);

      melody = new Tone.Loop((time) => {
        const randomNote = p.random(notes);
        synth.triggerAttackRelease(randomNote, "16n", time);
      }, "8n");
    };

    p.draw = function() {
      p.noStroke();

      p.fill(colors[0]);
      p.rect(0, 0, 100, p.height);
      p.fill(colors[1]);
      p.rect(100, 0, 100, p.height);
      p.fill(colors[2]);
      p.rect(200, 0, 100, p.height);
      p.fill(colors[3]);
      p.rect(300, 0, 100, p.height);

        p.fill("black")
        p.triangle(cursorX +5, cursorY - 5 , cursorX - 5, cursorY + 5, cursorX - 10 , cursorY -10)


      if (!audioStarted) {
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(14);
        p.text("Use the Start button to play audio", p.width / 2, p.height - 30);
      }
    };

    p.mouseMoved = function() {
      if (p.mouseX < 0 || p.mouseX > p.width || p.mouseY < 0 || p.mouseY > p.height) {
        return;
      }

      cursorX = p.mouseX;
      cursorY = p.mouseY;

      if (cursorX < 100) {
        synth.oscillator.type = "sine";
      } else if (cursorX < 200) {
        synth.oscillator.type = "triangle";
      } else if (cursorX < 300) {
        synth.oscillator.type = "square";
      } else {
        synth.oscillator.type = "sawtooth";
      }

      const cutoffFreq = p.map(cursorY, p.height, 0, 100, 8000);
      lpf.frequency.rampTo(cutoffFreq, 0.03);
    };

    function togglePlayback() {
      if (!audioStarted) {
        Tone.start();
        audioStarted = true;
      }

      if (!isPlaying) {
        melody.start(transportStarted ? Tone.Transport.seconds : 0);
        if (!transportStarted) {
          Tone.Transport.start();
          transportStarted = true;
        }
        isPlaying = true;
        startStopButton.html("Stop");
        startStopButton.style("background-color", "#c93838");
      } else {
        melody.stop();
        isPlaying = false;
        startStopButton.html("Start");
        startStopButton.style("background-color", "#2e9d45");
      }
    }

    p.doubleClicked = function() {
      melody.interval = doubleTime ? "8n" : "16n";
      doubleTime = !doubleTime;
    };
  };
}

const majorSketch = createMusicSketch(majorNotes, majorColors, "major-sketch");
const minorSketch = createMusicSketch(minorNotes, minorColors, "minor-sketch");
