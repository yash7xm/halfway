const express = require('express');
const app = express();
const ejs = require('ejs');
require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
let data;

app.use("/styles", express.static(__dirname + "/styles"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/images", express.static(__dirname + "/images"));


app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGO_PROD_URL)
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs');

const Sem1 = new mongoose.Schema({
  sem:
    [
      {
        subjects:
          [{
            subjectName: String,
            units:
              [
                {
                  unitName: String,
                  topics:
                    [
                      {
                        name: String,
                        content: String,
                      },
                    ]
                },
              ]
          },
          ]
      },
    ]
})

const Sem1Notes = mongoose.model('Sem1Notes', Sem1);
async function fetchData() {
 data = await Sem1Notes.find({});
}
let topicIndex, subjectIndex, unitIndex, givenText;
app.post('/notesSave', async (req, res) => {
  topicIndex = req.body.topicIndex;
  subjectIndex = req.body.subjectIndex;
  unitIndex = req.body.unitIndex;
  console.log(req.body);
  res.sendStatus(200);
})

app.get('/notes', async (req, res) => {
  await fetchData();
  res.render('notes', { topicIndex, subjectIndex, unitIndex, data });
})

app.get('/show', async (req, res) => {
  await fetchData();
  res.render('show', { data });
});

app.get('/sendNotes', async (req, res) => {
  await fetchData();
  res.json({ topicIndex, subjectIndex, unitIndex, data });
})

app.get('/delete', async (req, res) => {
  await Sem1Notes.deleteMany({});
});

app.get('/dog', async (req, res) => {
  await fetchData();
  res.json(data);
})

app.post('/startTyping', (req,res) => {
   givenText = req.body.content;
   res.sendStatus(200);
})

app.get('/typingTest', (req,res) => {
  res.render('test', {givenText});
})

app.listen('8080', () => {
  console.log('Running on port 8080');
})