const {
  registrationValidation,
  loginValidation,
} = require("../validation/validation");
const User = require("../models/User");
const Link = require("../models/Link");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

const reservedUsernames = ["register", "login", "dashboard"];

//// REGISTER NEW USER
async function register(req, res, next) {
  //validate data
  const { error } = registrationValidation(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });

  //check if email is already in database
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return next({ status: 400, message: "Email already registered" });
  // check if username is reserved
  if (reservedUsernames.includes(req.body.username))
    return next({ status: 400, message: "Username is reserved" });
  //check if username is already in database
  const usernameExists = await User.findOne({ username: req.body.username });
  if (usernameExists)
    return next({ status: 400, message: "Username already registered" });

  //Chceck if repeat_password is given;
  if (!req.body.repeat_password)
    return next({ status: 400, message: "Please confirm password" });

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
    const accessToken = generateAccessToken(user);
    const refreshToken = new RefreshToken({
      token: generateRefreshToken(user),
    });
    await refreshToken.save();
    res.send({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      accessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    next({ status: 400, message: err });
  }
}

////LOGIN USER
async function login(req, res, next) {
  //validate data
  const { error } = loginValidation(req.body);
  if (error) return next({ status: 400, message: error.details[0].message });

  //check if email is in database
  const user = await User.findOne({ email: req.body.email }).select(
    "+password"
  );
  if (!user) return next({ status: 400, message: "Invalid Email or Password" });

  //pasword is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return next({ status: 400, message: "Invalid Email or Password" });

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
      next({ status: 500, message: err });
    });
}

////REFRESH TOKENS
async function refresh(req, res) {
  const refreshToken = req.body.token;
  if (!refreshToken)
    return next({ status: 401, message: "You are not Authenticated" });
  const validToken = await RefreshToken.findOne({ token: refreshToken });
  if (!validToken)
    return next({ status: 403, message: "Refresh Token is not valid" });

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
    res.json({ error: err });
  }
}

async function logout(req, res) {
  const refreshToken = req.body.token;
  try {
    await RefreshToken.deleteOne({ token: refreshToken });
    res.status(200).json("You have logged out successfully");
  } catch (err) {
    res.json({ error: err });
  }
}

async function readUsername(req, res, next) {
  const username = req.params.username;
  const user = await User.findOne({ username }).select();
  if (!user) return next({ status: 404, message: "Username not found" });
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
