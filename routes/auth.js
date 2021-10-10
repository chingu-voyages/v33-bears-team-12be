const router = require("express").Router();
const verify = require("../auth/verifyToken");
const controller = require("../controllers/auth.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/register")
  .post(controller.register) //// REGISTER NEW USER
  .all(methodNotAllowed);

router
  .route("/login")
  .post(controller.login) //// LOGIN USER
  .all(methodNotAllowed);

router
  .route("/refresh")
  .post(controller.refresh) //// REFRESH TOKENS
  .all(methodNotAllowed);

router
  .route("/logout")
  .post(verify, controller.logout) //// LOGOUT USER
  .all(methodNotAllowed);

router
  .route("/username/:username")
  .get(controller.readUsername) //// GET USER INCLUDING LINKS, BY USERNAME
  .all(methodNotAllowed);

module.exports = router;
