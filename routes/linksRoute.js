const Link = require('../models/Link');
const express = require('express');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));

//// GET ALL LINKS FOR A SPECIFIC USER
router.get('/', async (req, res) => {
  try {
    const links = await Link.find();
    console.log('getting links');
    res.json(links);
  } catch (err) {
    res.json({ message: err });
  }
});

//// POST NEW LINK TO USER
// router.post('/', async (req, res) => {

//   const link = new Link({
//     title: req.body.title,
//     hyperlink: req.body.hyperlink,
//     //userId: req.body.userId,
//   });
//   try {
//     const savedLink = await link.save();
//     res.json(savedLink);
//   } catch (err) {
//     res.json({ message: err }, console.log(err));
//   }
// });

router.post('/', (req, res) => {
  console.log('posting links', req.body);
  const link = new Link({
    title: req.body.title,
    hyperlink: req.body.hyperlink,
    //userId: req.body.userId,
  });
  link
    .save()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err });
    });
});

// router.get('/specific', (req, res) => {
//   res.send('Specific link');
// });

module.exports = router;
