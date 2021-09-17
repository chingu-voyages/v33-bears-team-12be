const express = require('express');
const app = express();
const mongoose = require('mongoose');
const linksRoute = require('./routes/links');
require('dotenv/config');

// IMPORT ROUTES
const postLinks = require('./routes/links');

app.use('/links', linksRoute);

// ROUTES
app.get('/', (req, res) => {
  res.send('This is the home route');
});

const PORT = process.env.PORT;

// CONNECT TO DB
mongoose.connect(process.env.DB_CONNECTION, () =>
  console.log('connected to DB')
);

// HOW WE START LISTENING TO THE SERVER
app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
