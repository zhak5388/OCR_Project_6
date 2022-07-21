const bcrypt = require("bcrypt");
const userModel = require("../3_models/userModel");


exports.signup = (req, res, next) =>
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
            console.log("Utilisateur ajouté!");
            res.status(201).json({ message: 'Utilisateur créé !' });
        })
        .catch(error => 
        {
            console.log("Utilisateur déjà existant");
            res.status(400).json({ error });
        });
    })
    .catch(error =>
    {
        console.log("Autre erreur");
        res.status(500).json({ error })
    });

};

/*
signup = (req, res, next) =>
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
            //console.log("Utilisateur ajouté!");
            res.status(201).json({ message: 'Utilisateur créé !' })
        })
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));

};

exports.signup();
*/