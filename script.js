const connectButton = document.querySelector('#connect-midi-button');
connectButton.addEventListener('click', connectMIDI);

async function connectMIDI() {
    console.log("Connect Midi clicked!");
    try{
        const midiAccess = await navigator.requestMIDIAccess();
        for (const input of midiAccess.inputs.values()){
            console.log(`found: ${input.name} ${input.manufacturer} ${input.state} ${input.connection}`);
            await input.open();
            console.log(`Input connection: ${input.connection}`);
            input.addEventListener("midimessage", handleMIDIMessage);
        }
    } catch (error){
        console.log("An error occurred when connecting to MIDI: ", error.message);
    }
}

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
        console.log(`Pressed: ${note}`);
        key.classList.add("pressed");
    }
    else if (status === 128 || (status === 144 && velocity === 0)){
        console.log(`Released: ${note}`);
        key.classList.remove("pressed");
    }
}
