// DOM elements
const connectButton = document.querySelector('#connect-midi-button');
const overlay = document.querySelector('.overlay');
const midiStatus= document.querySelector('#midiStatus');
const modes = document.querySelectorAll('.mode-button')

// Practice Modes
const [freeMode, scaleMode] = ["free-play", "scale"]
let currentMode = freeMode

modes.forEach(mode => {
   mode.addEventListener('click', activateMode);
});

function activateMode(event){
    const clickedButton = event.target;
    modes.forEach(mode => {
        mode.classList.remove("active");
    });
    clickedButton.classList.add("active");
    currentMode = clickedButton.dataset.mode;
    console.log(`Changed mode to: ${currentMode}`);
}
// Scale and practice state
const cMajorNotes = [60, 62, 64, 65, 67, 69, 71, 72];

let expectedNoteIndex = 0;

// MIDI connection
connectButton.addEventListener('click', connectMIDI);

async function connectMIDI() {
    console.log("Connect Midi clicked!");
    try{
        const midiAccess = await navigator.requestMIDIAccess();
        if (midiAccess.inputs.size == 0){
            midiStatus.textContent = "No MIDI keyboard found."
            return;
        }
        for (const input of midiAccess.inputs.values()){
            console.log(`found: ${input.name} ${input.manufacturer} ${input.state} ${input.connection}`);
            await input.open();
            console.log(`Input connection: ${input.connection}`);
            input.addEventListener("midimessage", handleMIDIMessage);

        }
        overlay.classList.add("hidden");
    } catch (error){
        console.log("An error occurred when connecting to MIDI: ", error.message);
        midiStatus.textContent = "Failed to connect to MIDI.";
    }
}

// MIDI event handling
function handleMIDIMessage(event){
    // filter out non piano-key events (I'm here messages)
    if (event.data[0] === 254)
        return;
    const [status, note, velocity] = event.data;

    const midiQuery = `[data-midi-note="${note}"]`;
    const key = document.querySelector(midiQuery);
    if (key === null)
        return;

    if (status === 144 && velocity > 0){
        if(currentMode === freeMode){
            key.classList.add("pressed");
        }
        else if(currentMode === scaleMode){
            console.log(`Pressed: ${note} Expected: ${cMajorNotes[expectedNoteIndex]}`);
        }
    }
    else if (status === 128 || (status === 144 && velocity === 0)){ 
        key.classList.remove("pressed");
    }
}




