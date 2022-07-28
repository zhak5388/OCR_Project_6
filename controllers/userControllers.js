const bcrypt = require("bcrypt");
const jsonWebToken = require("jsonwebtoken");
const userModel = require("../models/userModel");

//Contrôleur permettant d'ajouter un utilisateur
const signUp = (req, res, next) =>
{
    bcrypt.hash(req.body.password, 10).then( hash =>
    {
        const user = new userModel(
        {
                email: req.body.email,
                password: hash
        });
        user.save().then(() =>
        {
            res.status(201).json({ message: "Utilisateur créé !" });
        })
        .catch(error => 
        {
            res.status(400).json({ error });
        });
    })
    .catch(error =>
    {
        res.status(500).json({ error })
    });

};

//Contrôleur permettant à un utilisateur de se connecter
const login = (req, res, next) =>
{
    userModel.findOne({email : req.body.email}).then( user =>
    {
        if(user == null)
        {
            return res.status(401).json({message: "Email ou mot de passe incorrect"});
        }

        bcrypt.compare(req.body.password, user.password).then( valid => 
        {
            if(!valid)
            {
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