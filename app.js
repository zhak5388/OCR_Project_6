/*
const test_require = require("./testing_directory/test_require");
test_require();
//The require functioon is a way to include modules that exists in a separated file
// 1) It reads the js file
// 2) It executes the file
// 3) And proceedm then return (?) the exports objects
*/
//test
//const findOne = require("./2_controllers/userControllers");


//Importation des modules généraux
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

//Importation des variables d"environnement
const mongoDbUsername = process.env.MONGODB_USERNAME;
const mongoDdPassword = process.env.MONGODB_PASSWORD;
const imageDirectory = process.env.IMAGE_DIRECTORY;

//Importation des modules "routes"
const userRoutes = require("./1_routes/userRoutes");
const sauceRoutes = require("./1_routes/sauceRoutes");

//Importation du module express
const app = express();

mongoose.connect(`mongodb+srv://${mongoDbUsername}:${mongoDdPassword}@ocrproject6apipiiquante.yhnks.mongodb.net/?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => 
{
    console.log("Connexion à MongoDB réussie !")
})
.catch(() => 
{
    console.log("Connexion à MongoDB échouée !")
});

app.use(express.json());

app.use((req, res, next) => //Nom des parametres non pertinent, Ordre important
{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
});

app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

console.log("***APP.JS***");
console.log(__dirname);
console.log(path.join(__dirname, imageDirectory));
app.use("/" + imageDirectory, express.static(path.join(__dirname, imageDirectory)));
//Exportation de la fonction app
module.exports = app;