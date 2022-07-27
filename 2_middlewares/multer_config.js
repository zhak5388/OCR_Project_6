const multer = require("multer");
const formDataKeyValue = "image";
const uploadingDirectory = `${process.env.IMAGE_DIRECTORY}`;

const MIME_TYPES = 
{
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp"
};

const storage = multer.diskStorage
(
    {
        //Dans le cas de diskStorage, le dossier doit être préalablement crée, sinon erreur
        destination: (req, file, callback) => 
        {
            callback(null, uploadingDirectory);
        },
        //Potentiel problème dans la concatenation: à surveiller
        filename: (req, file, callback) => 
        {
            const name = file.originalname.split(" ").join("_").split(".")[0];
            //name = name.split(".")[0];
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + "_" + Date.now() + "." + extension);
        }
    }
);

//Le parametre à entrer dans single() est le nom de la clé telle qu'elle est définie au frontend de formData
//Il est à noter que formData n'est pas consolelogable.
const uploadImage = multer({storage: storage}).single(formDataKeyValue);

module.exports = {uploadImage}