const multer = require("multer");
const formDataKeyValue = "image"; //La clé telle qu'elle est définie dans le frontend est image
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
        destination: (req, file, callback) => 
        {
            callback(null, uploadingDirectory);
        },
        filename: (req, file, callback) => 
        {
            const name = file.originalname.split(" ").join("_").split(".")[0];
            const extension = MIME_TYPES[file.mimetype];
            callback(null, name + "_" + Date.now() + "." + extension);
        }
    }
);

const uploadImage = multer({storage: storage}).single(formDataKeyValue);

module.exports = {uploadImage}