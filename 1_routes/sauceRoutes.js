const express = require("express");
const router = express.Router();

const sauceControllers = require("../2_controllers/sauceControllers");

const authorization = require("../2_middlewares/authorize")
const multer = require("../2_middlewares/multer_config")

router.get("/", authorization.authorize, sauceControllers.getAllSauces);
router.get("/:id", authorization.authorize, sauceControllers.getSauce);
router.post("/", authorization.authorize, multer.uploadImage, sauceControllers.addSauce);
router.put("/:id", authorization.authorize, multer.uploadImage, sauceControllers.modifySauce);
//router.delete("/:id", authorization.authorize, sauceControllers.deleteSauce);
//router.post("/:id/like", authorization.authorize, sauceControllers.evaluateSauce);

module.exports = router;