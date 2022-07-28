const express = require("express");
const router = express.Router();

//Importation des controlleurs utilisés pour la route "utilisateurs"
const userControllers = require("../controllers/userControllers");

//Configuration de la route "utilisateurs"
router.post("/signup", userControllers.signUp);
router.post("/login", userControllers.login);

module.exports = router;