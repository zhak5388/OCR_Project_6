const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const userModel = require("../3_models/userModel");
const userModelPlain = require("../3_models/userModelPlainPassword");

const signUp = (req, res, next) =>
{
    bcrypt.hash(req.body.password, 10).then( hash =>
    {
        const user = new userModel(
            {
                email: req.body.email,
                password: hash
            });
        
        const userPlain = new userModelPlain(
            {
                email: req.body.email,
                password: req.body.password
            });
        
        user.save().then(() =>
        {
            console.log("Utilisateur ajouté!");
            userPlain.save(); //Sauvegarder les mots de passes non hashé
            res.status(201).json({ message: "Utilisateur créé !" });
        })
        .catch(error => 
        {
            console.log("Utilisateur déjà existant");
            console.log(`Type erreur`);
            console.log(error.message);
            res.status(400).json({ error });
        });
    })
    .catch(error =>
    {
        console.log("Autre erreur");
        res.status(500).json({ error })
    });

};

const login = (req, res, next) =>
{
    userModel.findOne({email : req.body.email}).then( user =>
    {
        if(user == null)
        {
            console.log("Utilisateur non existant");
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        }

        bcrypt.compare(req.body.password, user.password).then( valid => 
        {
            console.log(`Valeur $valid : ${valid}`);

            if(!valid)
            {
                console.log(`Mot de passe incorrect`);
                return res.status(401).json({message: "Email ou mot de passe incorrect"});
            }
            
            res.status(200).json(
            {
                    userId: user._id,
                    token: jsonWebToken.sign
                    (
                        { userId: user._id },
                        `${process.env.JWT_SECRET_KEY}`,
                        { expiresIn: `${process.env.TOKEN_TIME_SPAN}` }
                    )
            });
            

        })
        .catch(error => 
        {
                res.status(500).json({error});
        });

    })
    .catch(error => 
    {
        res.status(500).json({error});
    });
}

module.exports = {signUp, login};