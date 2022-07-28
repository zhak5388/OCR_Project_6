const express = require("express");
const router = express.Router();

//Importation des controlleurs utilisés pour la route "sauces"
const sauceControllers = require("../controllers/sauceControllers");

//Importation des middlewares utilisés
const authorization = require("../middlewares/authorize")
const multer = require("../middlewares/multer_config")

//Configuration de la route "sauces"
router.get("/", authorization.authorize, sauceControllers.getAllSauces);
router.get("/:id", authorization.authorize, sauceControllers.getSauce);
router.post("/", authorization.authorize, multer.uploadImage, sauceControllers.addSauce);
router.put("/:id", authorization.authorize, multer.uploadImage, sauceControllers.modifySauce);
router.delete("/:id", authorization.authorize, sauceControllers.deleteSauce);
router.post("/:id/like", authorization.authorize, sauceControllers.evaluateSauce);

module.exports = router;