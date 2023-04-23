const scrollContainer = document.querySelector('.scroll-container');
let frontBox = document.querySelector('.front-box');
let prevBox = document.querySelector('.prev-box');
let nextBox = document.querySelector('.next-box');
const heading = document.querySelector('.heading');
const startTyping = document.querySelector('.start-typing button');

const prevBtn = document.querySelector('#prev-btn');
const nextBtn = document.querySelector('#next-btn');
let topic, unit, sub, data;
fetchData();
async function fetchData() {
    try {
        const response = await fetch('http://localhost:8080/sendNotes');
        const obj = (await response.json());
        topic = obj.topicIndex;
        unit = obj.unitIndex;
        sub = obj.subjectIndex;
        data = obj.data;
        console.log(obj);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function center() {
    scrollContainer.scrollLeft = (document.querySelector('.front-box').offsetLeft - scrollContainer.offsetWidth / 2) + (document.querySelector('.front-box').offsetWidth / 2);
}

window.addEventListener('load', () => {
    center();
})

prevBtn.addEventListener('click', () => {
    heha();
    const newPrev = document.createElement('div');
    newPrev.classList.add('prev-box');
    prevBox.insertAdjacentElement('beforebegin', newPrev);
    scrollContainer.scrollLeft -= scrollContainer.offsetWidth / 2;
    setTimeout(function () {
        nextBox.remove();
    }, 500);
    console.log('hi');
    prevBox.classList.remove('prev-box');
    prevBox.classList.add('front-box');
    frontBox.classList.remove('front-box');
    frontBox.classList.add('next-box');
    topic--;
    if(topic < 0 && unit == 0 && sub == 0){
        unit = 4;
        sub = 4;
        topic = data[0].sem[0].subjects[sub].units[unit].topics.length - 1;
    }
    else if (topic < 0) {
        unit--;
        topic = data[0].sem[0].subjects[sub].units[unit].topics.length - 1;
    }
    else if (unit < 0) {
        unit = 4;
        sub--;
        topic = data[0].sem[0].subjects[sub].units[unit].topics.length - 1;
    }
    writeText();
    const nextElement = document.querySelector('.next-box .given-text');
    nextElement.remove();
});

nextBtn.addEventListener('click', () => {
    heha();
    const newNext = document.createElement('div');
    newNext.classList.add('next-box');
    nextBox.insertAdjacentElement('afterend', newNext);
    scrollContainer.scrollLeft += scrollContainer.offsetWidth / 2;
    setTimeout(function () {
        prevBox.remove();
    }, 500);
    nextBox.classList.remove('next-box');
    nextBox.classList.add('front-box');
    frontBox.classList.remove('front-box');
    frontBox.classList.add('prev-box');
    topic++;
    if(topic == data[0].sem[0].subjects[sub].units[unit].topics.length && unit == 4 && sub == 4){
        topic = 0;
        unit = 0;
        sub =0;
    }
    else if (topic == data[0].sem[0].subjects[sub].units[unit].topics.length) {
        topic = 0;
        unit++;
    }
    else if (unit == 5) {
        topic = 0;
        unit = 0;
        sub++;
    }
    writeText();
    const prevElement = document.querySelector('.prev-box .given-text');
    prevElement.remove();
});


function heha() {
    frontBox = document.querySelector('.front-box');
    prevBox = document.querySelector('.prev-box');
    nextBox = document.querySelector('.next-box');
}

function writeText() {
    heha();
    heading.innerText = data[0].sem[0].subjects[sub].units[unit].topics[topic].name
    const text = document.createElement('p');
    text.classList.add('given-text');
    text.innerText = data[0].sem[0].subjects[sub].units[unit].topics[topic].content
    frontBox.appendChild(text);
}

startTyping.addEventListener('click', async () => {
    console.log('clicked start typing button')
    await fetch('http://localhost:8080/startTyping', {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            content: data[0].sem[0].subjects[sub].units[unit].topics[topic].content
        })
    })
    window.location.href = 'http://localhost:8080/typingTest';
})