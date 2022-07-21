/*
const test_require = require("./testing_directory/test_require");
test_require();
//The require functioon is a way to include modules that exists in a separated file
// 1) It reads the js file
// 2) It executes the file
// 3) And proceedm then return (?) the exports objects
*/

//Importation des modules généraux
const express = require("express");
const mongoose = require("mongoose");

//Importation des variables d'environnement
const mongoDbUsername = process.env.MONGODB_USERNAME;
const mongoDdPassword = process.env.MONGODB_PASSWORD;

//Importation des modules "routes"
const userRoutes = require("./1_routes/userRoute");

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

app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use("/api/auth", userRoutes);

//Exportation de la fonction app
module.exports = app;