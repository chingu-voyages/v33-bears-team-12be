const {
  registrationValidation,
  loginValidation,
} = require("../validation/validation");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//// REGISTER NEW USER
async function register(req, res) {
  //validate data
  const { error } = registrationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if email is already in database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("Email already registered");

  //check if username is already in database
  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists)
    return res.status(400).send("Username already registered");

  //Chceck if repeat_password is given;
  if (!req.body.repeat_password)
    return res.status(400).send("Please confirm password");

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  // create new user
  const user = new User({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({
      user: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(400).send(err);
  }
}

////LOGIN USER
async function login(req, res) {
  //validate data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if email is in database
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) return res.status(400).send("Invalid Email");

  //pasword is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  //create and assign token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
}

module.exports = {
  register,
  login,
};
