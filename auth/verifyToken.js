const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const tokenHeader = req.header("auth-token");
  if (!tokenHeader) return res.status(401).send("Access Denied");

  try {
    const token = tokenHeader.split(" ")[1];
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).send("Invalid Token");
  }
};
