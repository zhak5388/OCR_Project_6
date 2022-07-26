const multer = require("multer");

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
            callback(null, "images");
        },
        filename: (req, file, callback) => 
        {
            const name = file.originalname.split(" ").join("_");
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + Date.now() + "." + extension);
        }
    }
);

module.exports = multer({storage: storage}).single("image");
//Methode diskStorage: Indique ou et quel nom au fichier à stocker
//Methode single: image indique qu"il ne stocke que des images?