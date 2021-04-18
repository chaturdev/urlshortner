import express, { Request, Response, NextFunction } from 'express'
import passport from "passport";
import { IVerifyOptions } from "passport-local";
import { User, UserDocument, AuthToken } from '../../models/User'
import "../config/passport";
import { check, sanitize, validationResult, body } from "express-validator";
import logger from "../utils/logger"
const router = express.Router()

router.post('/users/register', async (req: Request, res: Response) => {
    await body("username", "Email is not valid").isEmail().run(req);
    await body("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
    //await body("name", "name cannot be blank").isLength({ min: 1 }).run(req);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }
    let user = new User(
        {
            email: req.body.username,
            password: req.body.password
        })
    try {
        logger.info(`user is registered successfully`);
        const reslt = await user.save()
        return res.status(200).send(reslt)
    } catch (ex) {
        logger.error(`registeration failed with error:- ${ex}`);
        return res.status(500).send(ex);
    }
})

router.post('/users/authenticate', async (req: Request, res: Response, next: NextFunction) => {
    await check("email", "Email is not valid").isEmail().run(req);
    await check("password", "Password cannot be blank").isLength({ min: 1 }).run(req);
    await sanitize("email").normalizeEmail({ gmail_remove_dots: false }).run(req);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(500).send({ msg: "parm not passed " + errors.array() })
    }

    passport.authenticate("local", (err: Error, user: UserDocument, info: IVerifyOptions) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash("errors", info.message);
            return res.status(500).send({ msg: "parm not passed " + info.message })
        }
        req.logIn(user, (err) => {
            if (err) { return next(err); }
            return res.status(200).send({ msg: "Success! You are logged in." })
        });
    })(req, res, next);
})

export { router as userRouter }