const str = document.querySelector('.given-text');
const input = document.querySelector('#myInput');
const timerSet = document.querySelectorAll('li');
const watch = document.querySelector('.timer');
const time = document.querySelector('.bi-clock');

const originalString = str.textContent.replace(/\s+/g, ' ').trim();

let clock = 0;
let clockFlag = false;
let a = 0;
let gotInput = false;
let lineWidth = ((window.innerWidth * 70) / 100 ) - 40;
let wordWidth = 0;
console.log(lineWidth);
const stopWatch = document.createElement('div');


makeHtml(originalString);
function makeHtml(originalString) {
    str.innerHTML = ''
    const span = document.createElement('span')
    span.textContent = `${originalString[0]}`;
    span.style.borderLeft = "2px solid  #000080";
    span.classList.add(`span${0}`)
    str.insertAdjacentElement('beforeend', span)
    for (let i = 1; i < originalString.length; i++) {
        const span = document.createElement('span')
        span.textContent = originalString[i];
        span.classList.add(`span${i}`)
        str.insertAdjacentElement('beforeend', span)
    }
}

str.addEventListener('click', () => {
    input.focus();
});

input.style.height = '0';
input.style.width = '0';
input.style.border = '0';
input.style.padding = '0';


input.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Backspace') {
        e.preventDefault(); // Prevent the default behavior of the key combination
        return;
    }
    let ptr = input.value;
    let flag = false; // to check if removing notTyped class
    let once = true;
    if (ptr.length < 1) return; //if no character is left
    if (e.key === 'Backspace') {
        
        let index = document.querySelector(`p.given-text span.span${ptr.length - 1}`);
        // remove notTyped class from all chars till the place where space was entered
        while (index.classList.contains('notTyped')) {
            if (once) {
                index.style.borderRight = 'none';
                index.style.paddingRight = 2 + 'px';
            }
            once = false;
            index.classList.remove('notTyped')
            index.innerText = originalString[ptr.length - 1]
            ptr = ptr.slice(0, -1);
            index = document.querySelector(`p.given-text span.span${ptr.length - 1}`);
            flag = true;
        }
        if (flag) { // only if above loop ran
            // index = document.querySelector(`p.given-text span.span${ptr.length-1}`);
            input.value = ptr;
            input.value += originalString[ptr.length - 1];
        }
        else { // remove classes
            index.style.borderRight = 'none';
            index.style.paddingRight = 2 + 'px';
            index.classList.remove('right')
            index.classList.remove('wrong')
            index.innerText = originalString[ptr.length - 1]
        }
        console.log(index.offsetWidth);
        wordWidth -= index.offsetWidth;
    }
})

//handling the input
input.addEventListener('input', (e) => {
    if (input.value.length > 0 && clockFlag == true && clock !=0) {
        console.log('imin')
        clockFlag = false;
        watch.innerHTML = '';
        stopWatch.classList.add('watch');
        stopWatch.innerText = clock;
        watch.append(stopWatch);
        startTimer();
    }
    let p = input.value;
    if (p.length < 1) {
        let index = document.querySelector(`p.given-text span.span${0}`);
        index.innerText = `${originalString[0]}`;
        index.style.borderLeft = "2px solid  #000080";
        return;
    }

    let index = document.querySelector(`p.given-text span.span${p.length - 1}`);

    if (p[0] == ' ') { // to prevent typing space in start
        p = '';
        input.value = '';
        return;
    }
    if (p[p.length - 1] == ' ' && p[p.length - 2] == ' ') { // to prevent typing consecutive spaces
        input.value = input.value.slice(0, -1)
        return;
    }

    // if correct word is typed
    if (originalString[p.length - 1] === p[p.length - 1]) {
        if (p.length !== 0) {
            if (p.length > 1) {
                let beforeSpan = document.querySelector(`p.given-text span.span${p.length - 2}`);
                // index.textContent = `${index.textContent}`;
                index.style.borderRight = "2px solid  #000080";
                // index.style.animation = 'blink 1s linear infinite';
                index.style.paddingRight = 0 + 'px';
                // beforeSpan.textContent = `${beforeSpan.textContent[0]}`;
                beforeSpan.style.border = 'none';
                beforeSpan.style.paddingRight = 2 + 'px';
            }
            else {
                // if (index.textContent.length > 1) index.textContent = `${index.textContent[1]}|`;
                // else {
                //     index.textContent = `${index.textContent[0]}|`;
                // }
                if (p.length == 1) {
                    index.style.borderLeft = 'none';
                    index.style.paddingRight = 2 + 'px';
                }
                index.style.borderRight = '2px solid  #000080';
                index.style.paddingRight = 0 + 'px';
            }
            index.classList.add('right');
        }
    }
    else {
        // if space is typed b/w word
        if (p[p.length - 1] == ' ') {
            input.value = input.value.slice(0, -1);
            let oneTime = true;
            // add notTyped to all till next word, and copy orginal text
            for (let i = p.length - 1; i < originalString.length; i++) {
                if (originalString[p.length - 1] == ' ') break;
                if (oneTime) {
                    let beforeSpan = document.querySelector(`p.given-text span.span${p.length - 2}`);
                    // beforeSpan.textContent = `${beforeSpan.textContent[0]}`;
                    beforeSpan.style.borderRight = 'none';
                    beforeSpan.style.paddingRight = 2 + 'px';
                }
                oneTime = false;
                index.classList.add('notTyped');
                p += originalString[i];
                input.value += originalString[i];
                index = document.querySelector(`p.given-text span.span${p.length - 1}`);
            }
            // index.textContent = `${index.textContent}|`
            index.style.borderRight = '2px solid  #000080';
            index.style.paddingRight = 0 + 'px';
            input.value += " ";
            index.classList.add('notTyped');
            return;
        }
        if (originalString[p.length - 1] == ' ' && p[p.length - 1] != ' ') {
            input.value = input.value.slice(0, -1);
            return;
        }
        if (p.length > 1) {
            let beforeSpan = document.querySelector(`p.given-text span.span${p.length - 2}`);
            // index.textContent = `${index.textContent}`;
            index.style.borderRight = "2px solid  #000080";
            index.style.paddingRight = 0 + 'px';
            // beforeSpan.textContent = `${beforeSpan.textContent[0]}`;
            beforeSpan.style.border = 'none';
            beforeSpan.style.paddingRight = 2 + 'px';
        }
        else {
            // if (index.textContent.length > 1) index.textContent = `${index.textContent[1]}|`;
            // else index.textContent = `${index.textContent[0]}|`;
            if (p.length == 1) {
                index.style.borderLeft = 'none';
                index.style.paddingRight = 2 + 'px';
            }
            index.style.borderRight = "2px solid  #000080";
            index.style.paddingRight = 0 + 'px';
        }
        index.classList.add('wrong');
        // index.innerText = p[p.length - 1]
    }

    // let index = document.querySelector(`p.given-text span.span${p.length - 1}`);
    // console.log(index.offsetWidth);
     wordWidth += index.offsetWidth;
     if(wordWidth == lineWidth){
        console.log("ewual))");
     }
      console.log(wordWidth);

    if (p.length === originalString.length) {
        input.disabled = true;
        over = true;
        score();
        return;
    }
})

time.addEventListener('click', () => {
    if (a % 2 == 0) {
        time.style.color = '#ffd700';
        clockFlag = true;
    }
    else {
        time.style.color = 'white';
        clockFlag = false;
    }
    a++;
})

timerSet.forEach(item => {
    item.addEventListener('click', () => {
        if (clockFlag) {
            item.style.color = '#ffd700';
            clock = (item.getAttribute('value'));
        }
    })
});



function startTimer() {
    setTimeout(() => {
        clock--;
        console.log(clock);
        stopWatch.innerText = clock;
        if (clock != 0) startTimer();
    }, 1000)
}
