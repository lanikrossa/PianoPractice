// DOM elements
const connectButton = document.querySelector('#connect-midi-button');
const midiOverlay = document.querySelector('#midi-overlay');
const completionOverlay = document.querySelector('#completion-overlay');
const midiStatus= document.querySelector('#midiStatus');
const midiConnectionStatus = document.querySelector('#midiConnectionStatus');
const modes = document.querySelectorAll('.mode-button')
const keys = document.querySelectorAll('.keyboard button')
const modeDescription = document.querySelector('#modeDescription');
const practiceHint = document.querySelector('#practiceHint');

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
        mode.setAttribute("aria-pressed", "false");
    });
    clickedButton.classList.add("active");
    clickedButton.setAttribute("aria-pressed", "true");
    currentMode = clickedButton.dataset.mode;
    if (currentMode === scaleMode){
        keys.forEach(key => {
            key.classList.remove("pressed");
            key.classList.remove("incorrect");
            key.classList.remove("correct");      
        });
        expectedNoteIndex = 0;
        modeDescription.textContent = "C Major scale";
        practiceHint.textContent = "Play the scale starting at Middle C.";
    } else if (currentMode === freeMode){
        keys.forEach(key => {
            key.classList.remove("incorrect");
            key.classList.remove("correct");            
        });
        modeDescription.textContent = "Explore the Keys";
        practiceHint.textContent = "Play any note on your piano to see it light up here.";
    }
    console.log(`Changed mode to: ${currentMode}`);
}
// Scale and practice state
const cMajorNotes = [60, 62, 64, 65, 67, 69, 71, 72];
let expectedNoteIndex = 0;

// MIDI connection
connectButton.addEventListener('click', connectMIDI);

async function connectMIDI() {
    console.log("Connect Midi clicked!");
    const connectButtonLabel = connectButton.querySelector('span:first-child');
    connectButton.disabled = true;
    connectButtonLabel.textContent = "Looking for piano…";
    midiStatus.textContent = "";
    try{
        if (!navigator.requestMIDIAccess){
            throw new Error("Web MIDI is not supported in this browser.");
        }
        const midiAccess = await navigator.requestMIDIAccess();
        if (midiAccess.inputs.size == 0){
            midiStatus.textContent = "No MIDI keyboard found. Check the cable and try again."
            connectButton.disabled = false;
            connectButtonLabel.textContent = "Try again";
            return;
        }
        for (const input of midiAccess.inputs.values()){
            console.log(`found: ${input.name} ${input.manufacturer} ${input.state} ${input.connection}`);
            await input.open();
            console.log(`Input connection: ${input.connection}`);
            input.addEventListener("midimessage", handleMIDIMessage);
        }
        midiConnectionStatus.classList.add("connected");
        midiConnectionStatus.setAttribute("aria-label", "MIDI piano connected");
        midiConnectionStatus.querySelector('.midi-pill__label').textContent = "Piano connected";
        midiOverlay.classList.add("hidden");
    } catch (error){
        console.log("An error occurred when connecting to MIDI: ", error.message);
        midiStatus.textContent = error.message || "Failed to connect to MIDI.";
        connectButton.disabled = false;
        connectButtonLabel.textContent = "Try again";
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
            if(expectedNoteIndex >= cMajorNotes.length){
                return;
            }
            clearIncorrectKeys();
            if(note === cMajorNotes[expectedNoteIndex]){
                key.classList.add("correct");
                expectedNoteIndex++;
                if (expectedNoteIndex === cMajorNotes.length){
                    completionOverlay.classList.remove("hidden");
                    setTimeout(() => {
                        completionOverlay.classList.add("hidden");
                        clearIncorrectKeys();
                        clearCorrectKeys();
                        expectedNoteIndex = 0;
                    }, 5000);
                }
            }else{
                key.classList.add("incorrect");
            }
        }
    }
    else if (status === 128 || (status === 144 && velocity === 0)){ 
        key.classList.remove("pressed");
    }

    function clearIncorrectKeys(){
        keys.forEach(key => {
            key.classList.remove("incorrect");  
        });        
    }

    function clearCorrectKeys(){
        keys.forEach(key => {
            key.classList.remove("correct");  
        });        
    }
}
