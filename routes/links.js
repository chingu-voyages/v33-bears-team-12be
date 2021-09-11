const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('We are on links');
});

router.get('/specific', (req, res) => {
  res.send('Specific link');
});


module.exports = router;