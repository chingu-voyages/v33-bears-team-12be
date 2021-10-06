const {
  registrationValidation,
  loginValidation,
} = require("../validation/validation");
const User = require("../models/User");
const Link = require("../models/Link");
const RefreshToken = require("../models/RefreshToken");
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

const generateAccessToken = (user) => {
  return jwt.sign(
    { _id: user._id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
};
const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET
  );
};

////LOGIN USER
async function login(req, res) {
  //validate data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if email is in database
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) return res.status(400).send("Invalid Email or Password");

  //pasword is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Email or Password");

  //create and assign Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = new RefreshToken({ token: generateRefreshToken(user) });
  refreshToken
    .save()
    .then((data) => {
      res.status(200).json({
        username: user.username,
        _id: user._id,
        accessToken,
        refreshToken: refreshToken.token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({ message: err });
    });
}

////REFRESH TOKENS
async function refresh(req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).send("You are not Authenticated");
  const validToken = await RefreshToken.findOne({ token: refreshToken });
  if (!validToken) return res.status(403).send("Refresh Token is not valid");
  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    await RefreshToken.deleteOne({ token: refreshToken });
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = new RefreshToken({
      token: generateRefreshToken(user),
    });
    await newRefreshToken.save();
    res.status(200).json({
      username: user.username,
      _id: user._id,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken.token,
    });
  } catch (err) {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ messages: err });
  }
}

async function logout(req, res) {
  const refreshToken = req.body.token;
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.status(200).json("You have logged out successfully");
  } catch (err) {
    res.json({ messages: err });
  }
}

async function readUsername(req, res) {
  const username = req.params.username;
  const user = await User.findOne({ username }).select();
  if (!user) return res.status(404).json({ error: "Username not found" });
  const links = await Link.find({ userId: user._id });
  const userWithLinks = {
    _id: user._id,
    username: user.username,
    name: user.name,
    links,
  };
  res.send(userWithLinks);
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  readUsername,
};
