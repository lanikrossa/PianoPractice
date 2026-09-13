const keyboard = document.querySelector('.keyboard');

for (const key of keyboard.children) {
    console.log(key.dataset.note);
}