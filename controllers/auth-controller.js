const { User } = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { HttpErrors } = require("../helpers/index");
const { CtrlWrapper } = require("../helpers/index");


const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpErrors(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const result = await User.create({email, password: hashPassword});
    res.status(201).json({
        user: {
      email: result.email,
      subscription: result.subscription,
    },
    })
}

const login = async (req, res) => {
     const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpErrors(401, "Email or password is wrong"); 
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if(!comparePassword) {
        throw HttpErrors(401, "Email or password is wrong");
    }
    const payload = {
        _id: user._id
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" });
    await User.findByIdAndUpdate(user._id, { token });
    res.json({
        token,
         user: { email: user.email, subscription: user.subscription },
    });
}

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findOneAndUpdate(_id, { token: "" });
    res.status(204).json()
    
}

const updateSubscriptionUser = async (req, res) => {
  const { _id } = req.user
  const result = await User.findByIdAndUpdate(_id, { ...req.body }, { new: true })
  res.json(result)
}

module.exports = {
    register: CtrlWrapper(register),
    login: CtrlWrapper(login),
    getCurrent: CtrlWrapper(getCurrent),
    logout: CtrlWrapper(logout),
    updateSubscriptionUser: CtrlWrapper(updateSubscriptionUser),
}