const sauceModel = require("../3_models/sauceModel");
const fs = require('fs');

const getAllSauces = (req, res, next) =>
{
    sauceModel.find().then(allSauces => 
    {
            //console.log("***getAllSauces***");
            //console.log(allSauces);
            res.status(200).json(allSauces);
    })
    .catch(error => res.status(400).json({error}));
}

const getSauce = (req, res, next) =>
{
    sauceModel.findOne({_id: req.params.id}).then(selectedSauce => 
    {
        //console.log("***getSauce***");
        //console.log(selectedSauce);
        res.status(200).json(selectedSauce);
    })
    .catch(error => res.status(400).json({error}));
}

const addSauce = (req, res, next) => 
{
    const sauceObject = JSON.parse(req.body.sauce);
    //console.log("***addSauce***");
    //console.log("*sauceObject*");
    //console.log(sauceObject);
    const sauce = new sauceModel(
    {
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/${process.env.IMAGE_DIRECTORY}/${req.file.filename}`
    });
    //console.log("***addSauce***");
    //console.log("*sauce*");
    //console.log(sauce);
    sauce.save().then(() => 
    {
            console.log("***addSauce***");
            console.log("Sauce ajoutée!");
            res.status(201).json({message: 'Sauce enregistée !'})
    })
    .catch(error => 
    {
            console.log("***addSauce***");
            console.log("Erreur");
            res.status(500).json({error})
    });
};

const modifySauce = (req, res, next) =>
{
    //Opérateur conditionnel terciaire
    // var variable = (condition) ? valeur_à_assigner_à_variable_si_vraie : valeur_à_assigner_à_variable_si_faux
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/${process.env.IMAGE_DIRECTORY}/${req.file.filename}`
    } : {...req.body};

    sauceModel.findOne({_id: req.params.id}).then( currentSauce => 
    {
        if(req.auth.userId != currentSauce.userId)
        {
            console.log("utilisateur non autorisé");
            res.status(401).json({message: "Utilisateur non autorisé"});
        }
        else if(req.auth.userId == currentSauce.userId)
        {
            console.log("utilisateur autorisé");
            if(sauceObject.imageUrl)//Si changement d'image /donc si sauceObject existe
            {
                const imageFileName = currentSauce.imageUrl.split(`/${process.env.IMAGE_DIRECTORY}/`)[1];
                fs.unlink(`${process.env.IMAGE_DIRECTORY}/${imageFileName}`, () =>
                {
                    sauceModel.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}).then( () => 
                    {
                        res.status(200).json({message: "Modifications apportées avec succès!"});
                    })
                    .catch(error => res.status(400).json({error}));
                });
            }
            else
            {
                sauceModel.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id}).then( () => 
                {
                    res.status(200).json({message: "Modifications apportées avec succès!"});
                })
                .catch(error => res.status(400).json({error}));
            }
        }
    })
    .catch( error => 
    {
        res.status(500).json({ error });
    });
}

const deleteSauce = (req, res, next) =>
{
    sauceModel.findOne({_id: req.params.id}).then( currentSauce => 
    {
        if(req.auth.userId != currentSauce.userId)
        {
            res.status(401).json({message: "Utilisateur non autorisé"});
        }
        else if(req.auth.userId == currentSauce.userId)
        {
            const imageFileName = currentSauce.imageUrl.split(`/${process.env.IMAGE_DIRECTORY}/`)[1];
            fs.unlink(`${process.env.IMAGE_DIRECTORY}/${imageFileName}`, () =>
            {
                sauceModel.deleteOne({_id: req.params.id}).then( () => 
                {
                    res.status(200).json({message: "Suppression effectuée avec succès!"});
                })
                .catch(error => res.status(400).json({error}));
            });
        }
        })
        .catch( error => 
        {
            res.status(500).json({ error });
        });

}

const evaluateSauce = (req, res, next) =>
{
    if(req.body.like === -1)
    {
        sauceModel.updateOne({_id: req.params.id},{$inc : {dislikes: -1}, $push: {usersDisliked: req.body.userId}})
        .then( () => 
        {
            //console.log(sauce.usersDisliked);
            //console.log(sauce.usersLiked);
            //req.body.like = 100;
            res.status(200).json({message: "Ajout du dislike operé avec succès!"})
        })
        .catch( error => res.status(400).json({error}) );
    }

    else if(req.body.like === 1)
    {
        sauceModel.updateOne({_id: req.params.id},{$inc : {likes: 1}, $push: {usersLiked: req.body.userId}})
        .then( () => res.status(200).json({message: "Ajout du like operé avec succès!"}))
        .catch( error => res.status(400).json({error}) );
    }

    else if(req.body.like === 0)
    {
        
    }

}

module.exports = {getAllSauces, getSauce, addSauce, modifySauce, deleteSauce, evaluateSauce};