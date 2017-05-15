const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

// grab a port for heroku to set, yet still be able to run locally
const port = process.env.PORT || 3000;
let app = express();

// register "partials"
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');


// Middleware using the next parameter
// create a logger and a timestamp
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  })
  next();
});

// Middleware to handle the maintenance page
// Note:  The next() function isn't called, so the site renders the maintenance
// page and can't navigate out of it.
// NOTE:  Middleware is called in the order of the app.use() calls.
// Nothing can work on the site until this is commented out.
/*
app.use((req, res, next) => {
  res.render('maintenance.hbs');
});
*/

// this is moved down below the maintenance app.use() statement
app.use(express.static(__dirname + '/public'));

// create a register helper partial to handle the Date;
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

// create another to shout in upper case
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// home screen template
app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to this website',
  })
});

// about page template
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

// // maintenance page template
// app.get('/maintanance', (req, res) => {
//   res.render('about.hbs', {
//     pageTitle: 'Maintanance Page',
//
//   });
// });


app.get('/bad', (req, res) => {
  res.send({
    errorMessage:  'Unable to handle request.'
  })
});

// use the port constant to use either heroku's supplied port, or a local
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});


// L47-48 - setting up the project with git and heroku:
