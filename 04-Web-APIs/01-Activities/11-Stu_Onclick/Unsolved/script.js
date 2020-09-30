var counter = 0;
var countEl = document.querySelector('#count');

function displayCount() {
    countEl.textContent = counter;
}

function increment(inc) {
    counter += inc;
}

document.querySelector('#increment').addEventListener('click', () => {
    increment(1);
    displayCount();
});

document.querySelector('#decrement').addEventListener('click', () => {
    increment(-1);
    displayCount();
});

