const express = require('express');
const { schemas } = require('../../models/user');
const ctrl = require("../../controllers/auth-controller");
const { validateBody, isEmptyBody, authenticate, upload} = require("../../middlewares/");
const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(schemas.registerSchema), ctrl.register);
authRouter.get('/verify/:verificationToken', ctrl.verify);
authRouter.post('/verify',validateBody(schemas.userEmailSchema), ctrl.resendVerify);
authRouter.post('/login', isEmptyBody, validateBody(schemas.loginSchema), ctrl.login);
authRouter.get('/current', authenticate, ctrl.getCurrent);
authRouter.post('/logout', authenticate, ctrl.logout);
authRouter.patch('/', authenticate, validateBody(schemas.updateSubscriptionSchema), ctrl.updateSubscriptionUser )
authRouter.patch('/avatars', authenticate, upload.single("avatar"), ctrl.updateAvatar);

module.exports = authRouter;