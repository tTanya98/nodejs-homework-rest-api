const jwt = require("jsonwebtoken");
const { User } = require('../models/user');
const { HttpErrors } = require("../helpers/index");

const {SECRET_KEY} = process.env;

const authenticate = async (req, res, next) => {
    const {authorization = ""} = req.headers;
    const [bearer, token] = authorization.split(" ");
    if(bearer !== "Bearer") {
        next(HttpErrors(401))
    }
    try {
        const {_id} = jwt.verify(token, SECRET_KEY);
        const user = await User.findById({_id});
        if(!user || !user.token || user.token !== token){
            next(HttpErrors(401))
        }
        req.user = user;
        next()
    } catch (error) {
        next(HttpErrors(401));
    }

}

module.exports = authenticate;