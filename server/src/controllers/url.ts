import express, { Request, Response, NextFunction } from 'express'
import { Url, UrlDocument } from '../../models/Url'
import { check, sanitize, validationResult, body } from "express-validator";
import logger from "../utils/logger"
const router = express.Router()

router.post('/urls/short', async (req: Request, res: Response) => {
    await body("url", "Password cannot be blank").isLength({ min: 1 }).run(req);
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() })
    }

    const url = req.body.url;
    const instance = new Url({
        url: url,
        visitors: 0
    });
    let short = JSON.stringify(instance._id)
    const id = short.slice(short.length - 7, short.length - 1)
    instance.id = id;
    await instance.save()
    res.send({
        message: `${id} was created`,
        url: `${id}`,
    });
})

router.get('/urls/list', async (req: Request, res: Response) => {
    logger.info(`list of all shorted url fetched`);
    const instance =  await Url.find();
    res.send(instance);
})
router.get('/urls/:route', async (req, res) => {
    const route = req.params.route;
    const instance = await Url.findOne({id: route});
     if(instance) {
      instance.visitors = instance.visitors + 1;
      await instance.save();
      logger.info(`url is routed ${route}`);
      res.redirect(`${instance.url}`)
    } else {
      res.send("404")
    }
  })
export { router as urlRouter }