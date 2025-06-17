const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const path = require('path');

const serviceAccount = require('./jeurole-16332-firebase-adminsdk-fbsvc-3a01cf3d22.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://jeurole-16332.firebaseio.com',
});

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/assets', express.static(__dirname + '/assets'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, '/public/login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '/public/register.html')));
app.get('/home', (req, res) => res.sendFile(path.join(__dirname, '/public/home.html')));

app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});
