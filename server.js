const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
app.use(express.urlencoded({extended: false}));
// Importing Routes
const userRoute = require('./routes/User')
const socialRoute = require('./routes/Social')


// Create the Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Implementing Routes
app.use("/user", userRoute)
app.use("/social", socialRoute)

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/friend-request-system?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
