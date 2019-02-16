const bodyParser = require('body-parser');
const configMessaje = require('./configMessage');
const exphbs = require('express-handlebars');
const express = require('express');
const path = require('path');


const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static Folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Routes
app.get('/', (req, res) => {
  res.render('contact');
});

app.post('/send', (req, res) => {
  configMessaje(req.body,res);
})

// Port Listener
app.listen(5001, () => {
  console.log('Server started on http://localhost:5001...');
})