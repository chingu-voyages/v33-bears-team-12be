const mongoose = require('mongoose');
const Link = require('./models/Link');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv/config');
// IMPORT ROUTES
const linksRoute = require('./routes/linksRoute');

app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use('/links', linksRoute);

// ROUTES
app.get('/', (req, res) => {
  res.send('This is the home route');
});

const PORT = process.env.PORT;

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () =>
  console.log('connected to DB')
);

// HOW WE START LISTENING TO THE SERVER
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
