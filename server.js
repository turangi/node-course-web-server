const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

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

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});


// L45 -  "Express Middleware" (see lines 4, 8-9)

// Challenge:  Create a new view "maintenance.hbs".  This will be a
// handlebars template that we'll render when the site is in maintenance mode.
// Give it a simple structure such as that in "home" or "about".
// Render an H1 tag such as "we'll be right back" , and  <p> tag such as:
// "the site is being updated, we'll be back soon"
// Render the template file inside a new piece of Middleware.  This means
// calling app.use() again, defining a function that calls res.render.  No
// need to call next();   Just write the one-line function call to response

// L46 will cover:
