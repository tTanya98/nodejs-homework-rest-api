const { HttpErrors } = require("../helpers");


const isEmptyBody = (req, res, next) => {
    const emptyBody = !Object.keys(req.body).length;
  if (emptyBody) {
    next(HttpErrors(400, "missing field favorite"));
  }
  next();
};

module.exports = isEmptyBody;