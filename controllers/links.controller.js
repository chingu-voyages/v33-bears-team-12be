const Link = require("../models/Link");
const { linkValidation } = require("../validation/validation");

//// GET ALL LINKS
async function list(req, res) {
  try {
    const links = await Link.find();
    console.log("getting links");
    res.json(links);
  } catch (err) {
    res.json({ error: err });
  }
}

//// POST NEW LINK TO USER
function create(req, res, next) {
  console.log("posting links", req.body);
  //validate data
  const { error } = linkValidation(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });
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
      res.json({ error: err });
    });
}

module.exports = {
  list,
  create,
};
