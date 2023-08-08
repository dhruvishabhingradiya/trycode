const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=reequire("cors")
const port = process.env.PORT || 6000

app.use(bodyParser.urlencoded());
app.use(express.json());
app.use(cors());
app.use(express.urlencoded());

mongoose.connect('mongodb://0.0.0.0:27017/user');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('home');
  });
  app.get('/logout', (req, res) => {
    res.redirect('login');
  });  
app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({ username, password });
  
    try {
      await newUser.save();
      res.send('Registration successful!');
    } catch (err) {
      console.error(err);
      res.send('Registration failed!');
    }
  });
  
  

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username, password }).exec();
      if (!user) {
        res.send('User not found!');
      } else {
        res.send('Login successful!');
      }
    } catch (err) {
      console.error(err);
      res.send('Login failed!');
    }
  });
  

  app.listen(port, function (error) {
      if (error) throw error
      console.log("Server created Successfully")
    });