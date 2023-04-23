const sem = document.getElementById("semester-select");
const notes = document.querySelector(".notes");
const subjects = document.querySelector('.subjects');
const unitButton = document.querySelectorAll('.units button');
let sub = 0;
let unit = 0;
let data;
fetchData();
async function fetchData() {
  try {
    const response = await fetch('http://localhost:8080/dog');
    const obj = (await response.json());
    data = obj;

    console.log(data[0].sem[0].subjects[0].units[0].topics.length);
    console.log(data);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
// console.log(Object.keys(data[0].sem[0].subjects[0].units[0].topics[0]).length);
sem.addEventListener('change', () => {
  console.log(sem.value);
  subjects.innerHTML = '';
  const heading = document.createElement('h4');
  heading.innerText = 'Subjects';
  subjects.insertAdjacentElement('beforeend', heading);
  unit = 0;
  sub = 0;
  for (let i = 1; i <= 4; i++, sub++) {
    if (sub >= 2) sub = 0;
    const btn = document.createElement('button');
    btn.innerText = `${data[0].sem[0].subjects[sub].subjectName}`;
    btn.value = `${i - 1}`;
    if (i == 1) btn.style.backgroundColor = '#ADD8E6';
    subjects.insertAdjacentElement('beforeend', btn);
  }
  sub = 0;
  unit = 0;
  const unit0Button = document.querySelector('.units button:first-child');
  unit0Button.style.backgroundColor = '#ADD8E6';
  showTopics();
})

subjects.addEventListener('click', event => {
  if (event.target.tagName === 'BUTTON') {
    console.log('clicked sub button');
    const buttons = subjects.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.style.backgroundColor = '';
    });

    sub = event.target.value;
    console.log(sub);
    event.target.style.backgroundColor = '#ADD8E6';
    showTopics();
  }
});


unitButton.forEach(button => {
  button.addEventListener('click', event => {
    console.log('clicked unit button')
    unitButton.forEach(btn => {
      btn.style.backgroundColor = '';
    });
    unit = event.target.value;
    console.log(unit);
    event.target.style.backgroundColor = '#ADD8E6';
    showTopics();
  })
})

notes.addEventListener('click', async (event) => {
  if (event.target.tagName == 'BUTTON' ||
    event.target.tagName == 'IMG' ||
    event.target.tagName == 'H6') {
    console.log('clicked mfr')
    console.log(event.target.value);
    await fetch('http://localhost:8080/notesSave', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topicIndex: 0,
        subjectIndex: sub,
        unitIndex: unit,
      })
    })
    window.location.href = 'http://localhost:8080/notes';
  }
})

function showTopics() {
  console.log('hello');
  notes.innerHTML = '';
  let index = 0;
  for (let topic of data[0].sem[0].subjects[sub].units[unit].topics) {
    const btn = document.createElement('button');
    btn.value = index;
    const card = document.createElement('div');
    card.classList.add('card');
    const imgDiv = document.createElement('div');
    imgDiv.classList.add('img');
    const img = document.createElement('img');
    img.src = "/images/32226690_m024t0221_d_books_01sep22.jpg";
    img.alt = "topic.name";
    img.value = index;
    imgDiv.insertAdjacentElement('beforeend', img);
    card.insertAdjacentElement('beforeend', imgDiv);
    const heading = document.createElement('div');
    heading.classList.add('topic');
    const name = document.createElement('h6');
    name.innerText = `${topic.name}`;
    name.value = index;
    heading.insertAdjacentElement('beforeend', name);
    card.insertAdjacentElement('beforeend', heading);
    btn.insertAdjacentElement('beforeend', card);
    notes.insertAdjacentElement('beforeend', btn);
    index++;
  }
}



