const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('node:path');

const dotenv = require('dotenv');
dotenv.config();


const PORT = process.env.PORT;

// Importing Routes
const userRoute = require('./routes/User')
const socialRoute = require('./routes/Social')
const cors = require('cors'); // Import the 'cors' middleware
const events = require('./messages/events')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Create the Express app
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);



// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
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

events.IntializeSocketEvents(io)


// Connect to MongoDB
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


// Start the server
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
