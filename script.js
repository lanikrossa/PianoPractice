const keyboard = document.querySelector('.keyboard');

for (const key of keyboard.children) {
    console.log(key.dataset.note);
}

const connect_button = document.querySelector('#connect-midi-button');

connect_button.addEventListener('click', async () => {
    console.log("Connect Midi clicked!");
    try{
        const midiAccess = await navigator.requestMIDIAccess();
        for (const input of midiAccess.inputs.values()){
            console.log(`found: ${input.name} ${input.manufacturer} ${input.state} ${input.connection}`)
            await input.open();
            console.log(`Input connection: ${input.connection}`)
            input.addEventListener("midimessage", keyinfo)
        }
    } catch (error){
        console.log("An error occurred when connecting to MIDI: ", error.message);
    }
});

function keyinfo(event){
    // filter out non piano-key events (I'm here messages)
    if (event.data[0] === 254)
        return;
    const [status, note, velocity] = event.data;
    // console.log(`Status: ${status}, Note: ${note}, Velocity: ${velocity}`)

    const midi_query = `[data-midi-note="${note}"]`
    const key = document.querySelector(midi_query);
    if (key == null)
        return;

    if (status === 144 && velocity > 0){
        console.log(`Pressed: ${note}`);
        key.classList.add("pressed");
    }
    else if (status === 128){
        console.log(`Released: ${note}`);
        key.classList.remove("pressed");
    }
}
