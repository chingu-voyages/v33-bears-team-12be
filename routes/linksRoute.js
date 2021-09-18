const Link = require('../models/Link');
const express = require('express');
const router = express.Router();
const verify = require('../auth/verifyToken');
const {linkValidation} = require('../validation/validation');

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

router.post('/', verify, (req, res) => {
  console.log('posting links', req.body);
  //validate data
  const {error} = linkValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //create link
  const link = new Link({
    title: req.body.title,
    hyperlink: req.body.hyperlink,
    userId: req.user._id, //req.user._id is the user's id, passed from verify middleware function.
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
