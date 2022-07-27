const sauceModel = require("../3_models/sauceModel");

const getAllSauces = (req, res, next) =>
{
    sauceModel.find().then(allSauces => 
    {
            console.log("***getAllSauces***");
            console.log(allSauces);
            res.status(200).json(allSauces);
    })
    .catch(error => res.status(400).json({error}));
}

const getSauce = (req, res, next) =>
{
    sauceModel.findOne({_id: req.params.id}).then(selectedSauce => 
    {
        console.log("***getSauce***");
        console.log(selectedSauce);
        res.status(200).json(selectedSauce);
    })
    .catch(error => res.status(400).json({error}));
}

const addSauce = (req, res, next) => 
{
    const sauceObject = JSON.parse(req.body.sauce);
    console.log("***addSauce***");
    console.log("*sauceObject*");
    console.log(sauceObject);
    const sauce = new sauceModel(
    {
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/${process.env.IMAGE_DIRECTORY}/${req.file.filename}`
    });
    console.log("***addSauce***");
    console.log("*sauce*");
    console.log(sauce);
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
    console.log("***modifySauce***");
    //console.log("*req.file*");
    //console.log(JSON.parse(req.file));
    console.log("*req.body.sauce*");
    console.log(JSON.parse(req.body.sauce));
    console.log("*req.body*");
    console.log(JSON.parse(req.body));
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/${process.env.IMAGE_DIRECTORY}/${req.file.filename}`
    } : {...req.body};

    console.log("*sauceObject*");
    console.log(sauceObject);
}

const deleteSauce = (req, res, next) =>
{

}

const evaluateSauce = (req, res, next) =>
{

}

module.exports = {getAllSauces, getSauce, addSauce, modifySauce};