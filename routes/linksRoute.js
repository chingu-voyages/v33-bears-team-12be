const express = require("express");
const router = express.Router();
const verify = require("../auth/verifyToken");
const controller = require("../controllers/links.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router.use(express.urlencoded({ extended: true }));

router
  .route("/")
  .get(controller.list) //// GET ALL LINKS
  .post(verify, controller.create) //// POST NEW LINK TO USER
  .all(methodNotAllowed);

module.exports = router;
