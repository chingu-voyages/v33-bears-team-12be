const express = require('express');
const router = express.Router();
const Link = require('../models/Link');

router.get('/', async (req, res) => {
  try {
    const links = await Link.find();
  } catch (err) {
    res.json({ message: err });
  }
});

router.post('/', async (req, res) => {
  const link = new Post({
    title: req.body.title,
    hyperlink: req.body.hyperlink,
  });

  try {
    const savedLink = await link.save();
    res.json(savedLink);
  } catch (err) {
    res.json({ message: err });
  }
});

// router.get('/specific', (req, res) => {
//   res.send('Specific link');
// });

module.exports = router;
