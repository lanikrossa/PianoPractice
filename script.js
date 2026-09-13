const keyboard = document.querySelector('.keyboard');

for (const key of keyboard.children) {
    console.log(key.dataset.note);
}

const connect_button = document.querySelector('#connect-midi-button');

connect_button.addEventListener('click', async () => {
    console.log("Connect Midi clicked!");
});
