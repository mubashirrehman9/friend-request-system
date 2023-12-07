const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path =require('node:path');
// Importing Routes
const userRoute = require('./routes/User')
const socialRoute = require('./routes/Social')
const cors = require('cors'); // Import the 'cors' middleware


// Create the Express app
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(cors());
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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/test.html'));
});

io.on('connection', async (socket) => {
  console.log("User Connected "+ socket.id);
});


// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/friend-request-system?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Start the server
http.listen(3000, () => {
  console.log('Server listening on port 3000');
});
