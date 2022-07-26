const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchemaPlain = mongoose.Schema
(
    {
        email: {type: String, required: true, unique: true},
        password: {type: String, required: true}
    }
);

userSchemaPlain.plugin(uniqueValidator);

module.exports = mongoose.model("userModelPlain", userSchemaPlain);