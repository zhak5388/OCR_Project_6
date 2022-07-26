const express = require("express");
const router = express.Router();
const userController = require("../2_controllers/userControllers");
const uploadFile = require("../testing_directory/test_multer");

//uploadFile.single("https://assets.pokemon.com/assets/cms2/img/pokedex/full/387.png");
router.post("/signup", userController.signUp);
router.post("/login", userController.login);

module.exports = router;