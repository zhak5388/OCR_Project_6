const sauceModel = require("../models/sauceModel");
const fs = require("fs");

//Contrôleur permettant d'obtenir tous les sauces
const getAllSauces = (req, res, next) =>
{
    sauceModel.find().then(allSauces => 
    {
        res.status(200).json(allSauces);
    })
    .catch(error => res.status(400).json({error}));
}

//Contrôleur permettant d'obtenir une sauce donnée
const getSauce = (req, res, next) =>
{
    sauceModel.findOne({_id: req.params.id}).then(selectedSauce => 
    {
        res.status(200).json(selectedSauce);
    })
    .catch(error => res.status(400).json({error}));
}

//Contrôleur permettant d'ajouter une sauce
const addSauce = (req, res, next) => 
{
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new sauceModel(
    {
        ...sauceObject,//|| Opérateur (...) : Permet de copier un objet
        imageUrl: `${req.protocol}://${req.get("host")}/${process.env.IMAGE_DIRECTORY}/${req.file.filename}`
    });
    sauce.save().then(() => 
    {
            res.status(201).json({message: "Sauce ajoutée !"})
    })
    .catch(error => 
    {
            res.status(500).json({error})
    });
};

//Contrôleur permettant de modifier une sauce
const modifySauce = (req, res, next) =>
{
    //|| Opérateur conditionnel terciaire
    //|| var variable = (condition) ? valeur_à_assigner_à_variable_si_vraie : valeur_à_assigner_à_variable_si_faux
    //|| https://developer.mozilla.org/fr/docs/Web/JavaScript/Guide/Expressions_and_Operators
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/${process.env.IMAGE_DIRECTORY}/${req.file.filename}`
    } : {...req.body};

    sauceModel.findOne({_id: req.params.id}).then( currentSauce => 
    {
        //Vérification supplémentaire pour s'assurer que seul le proprietaire peut modifier la sauce
        if(req.auth.userId != currentSauce.userId)
        {
            res.status(401).json({message: "Utilisateur non autorisé"});
        }
        else if(req.auth.userId == currentSauce.userId)
        {
            if(sauceObject.imageUrl)//Cet objet existe uniquement si il y a un changement d'image (voir frontend)
            {
                //Suppression et mise à jour de la base de données si l'image a été modifiée
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

//Contrôleur permettant de supprimer une sauce
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

//Contrôleur gérant l'ajout et la suppression de like/dislike
const evaluateSauce = (req, res, next) =>
{
    //Cas d'ajout d'un dislike
    if(req.body.like === -1)
    {
        sauceModel.findOne({_id: req.params.id, usersLiked:{ $in : [req.body.userId]}}).then( currentSauce =>
        {   
            if (currentSauce == null)//Si il n'y a pas de présence de like sur la base de données alors ajout
            {
                sauceModel.updateOne({_id: req.params.id},{$inc : {dislikes: 1}, $push: {usersDisliked: req.body.userId}})
                .then( () => res.status(200).json({message: "Ajout du dislike operé avec succès!"}))
                .catch( error => res.status(400).json({error}) );
            }

            else
            {
                res.status(400).json({error});
            }
        
        })
        .catch( error => res.status(500).json({error}));
    }

    //Cas d'ajout d'un like
    else if(req.body.like === 1)
    {
        sauceModel.findOne({_id: req.params.id, usersDisliked:{ $in : [req.body.userId]}}).then( currentSauce =>
            {   
                //Si il n'y a pas de présence de dislike sur la base de données alors ajout du dit like
                if (currentSauce == null)
                {
                    sauceModel.updateOne({_id: req.params.id},{$inc : {likes: 1}, $push: {usersLiked: req.body.userId}})
                    .then( () => res.status(200).json({message: "Ajout du like operé avec succès!"}))
                    .catch( error => res.status(400).json({error}) );
                }
    
                else
                {
                    res.status(400).json({error});
                }
            
            })
        .catch( error => res.status(500).json({error}));
    }

    //Cas d'annulation d'un like ou dislike
    else if(req.body.like === 0)
    {
        sauceModel.findOne({_id: req.params.id, usersDisliked:{ $in : [req.body.userId]}}).then( data =>
        {   
            //Si le dislike est présent dans la base de données
            if(data?.usersDisliked) //|| Chaînage optionnel | https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Operators/Optional_chaining
            //|| Permet de lire une donnée même si elle n'est pas completement valide
            {
                //Alors suppression du dit dislike
                sauceModel.updateOne({_id: req.params.id}, {$inc : {dislikes: -1}, $pull: {usersDisliked: req.body.userId}})
                .then( () => res.status(200).json({message: "Supression du dislike operée avec succès!"}))
                .catch( error => res.status(400).json({error}) );
            }
            
            //Sinon suppression du dit like de la base de données
            else
            {
                sauceModel.updateOne({_id: req.params.id}, {$inc : {likes: -1}, $pull: {usersLiked: req.body.userId}})
                .then( () => res.status(200).json({message: "Supression du like operée avec succès!"}))
                .catch( error => res.status(400).json({error}) );
            }
        })
        .catch( error => res.status(500).json({error}));
    }

}

module.exports = {getAllSauces, getSauce, addSauce, modifySauce, deleteSauce, evaluateSauce};