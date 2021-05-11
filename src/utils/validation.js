const validator = require("validator");

const validEmail = (email) => validator.isEmail(email);
const validObjectId = (id) => validator.isMongoId(id);

module.exports = { validEmail, validObjectId };
