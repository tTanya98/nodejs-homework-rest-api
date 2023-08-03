const express = require('express');
const { schemas } = require('../../models/user');
const ctrl = require("../../controllers/auth-controller");
const { validateBody, isEmptyBody, authenticate } = require("../../middlewares/");
const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(schemas.registerSchema), ctrl.register);
authRouter.post('/login', isEmptyBody, validateBody(schemas.loginSchema), ctrl.login);
authRouter.get('/current', authenticate, ctrl.getCurrent);
authRouter.post('/logout', authenticate, ctrl.logout);
authRouter.patch('/', authenticate, validateBody(schemas.updateSubscriptionSchema), ctrl. updateSubscriptionUser )

module.exports = authRouter;