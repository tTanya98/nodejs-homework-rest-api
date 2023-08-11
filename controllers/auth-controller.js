const { User } = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { HttpErrors } = require("../helpers/index");
const { CtrlWrapper } = require("../helpers/index");
const { sendEmail } = require("../helpers/index");
const gravatar = require("gravatar");
const path = require('path');
const fs = require("fs/promises");
const Jimp = require('jimp');
const { nanoid } = require("nanoid");

const { SECRET_KEY, BASE_URL } = process.env;
const  avatarsDir = path.join(__dirname, "../", "public", "avatars");
const verificationToken = nanoid();

const register = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(user){
        throw HttpErrors(409, "Email in use");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const result = await User.create({email, password: hashPassword, avatarURL, verificationToken});
   
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target= "_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.status(201).json({
        user: {
      email: result.email,
      subscription: result.subscription,
    },
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpErrors(404, "User not found");        
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });

    res.json({
        message: "Verification successful",
    })
    
}

const resendVerify = async (req, res) => {
     const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpErrors(404, "User not found");
  }

  if (user.verify) {
    throw HttpErrors(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verification email sent",
  });
}

const login = async (req, res) => {
     const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpErrors(401, "Email or password is wrong"); 
    }
    if (!user.verify) {
        throw HttpErrors(401, "Verification error");   
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

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);

    const resizeFile = await Jimp.read(resultUpload);
    await resizeFile.resize(250, 250).write(resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

   res.json({
       avatarURL,
   })
}

module.exports = {
    register: CtrlWrapper(register),
    verify: CtrlWrapper(verify),
    resendVerify: CtrlWrapper(resendVerify),
    login: CtrlWrapper(login),
    getCurrent: CtrlWrapper(getCurrent),
    logout: CtrlWrapper(logout),
    updateSubscriptionUser: CtrlWrapper(updateSubscriptionUser),
    updateAvatar: CtrlWrapper(updateAvatar),
}