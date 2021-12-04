import {Model, DataTypes, Sequelize} from "sequelize";
import {publicIdDecode, publicIdEncode, UUIDPrefixLen} from "./publicIDEncoder";
import {init, LinkAlias} from "./db/structure";

const validUrl = require('valid-url')
const express = require('express');
const router = express.Router();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/usr/src/db/urls.db'
});

init(sequelize)

// sequelize.sync({force: true})

router.get('/', (req: any, res: any, next: any) => {
    res.render('index');
});

router.get('/:link', async (req: any, res: any, next: () => any) => {
    let decoded
    try {
        decoded = publicIdDecode(req.params.link)
        if (decoded.id === undefined || decoded.id === null ||
            decoded.uuid === undefined || decoded.uuid === null) {
            return next();
        }
    } catch (e) {
        return next()
    }

    const row = await LinkAlias.findOne({
        where: {
            index: decoded.id
        }
    })

    if (row === null || row === undefined) {
        return next();
    }

    if(row.uuid.substring(0, UUIDPrefixLen) !== decoded.uuid) {
        return next();
    }

    return res.redirect(row.initial)
});

router.post('/n/', async (req: any, res: any, next: () => any) => {
    let {
        longUrl
    } = req.body
    if(!validUrl.isUri(longUrl)){
        longUrl = "https://" + longUrl
    }
    if (!validUrl.isUri(longUrl)) {
        console.log(req.body)
        return res.status(400).render('info', {data: 'Invalid URL'});
    }

    try {
        let url = await LinkAlias.findOne({
            where: {
                "initial": longUrl
            }
        })

        if (url) {
            res.json({
                "longUrl": url.initial,
                "shortUrl": publicIdEncode(url.index, url.uuid)
            })
        } else {
            url = new LinkAlias({
                initial: longUrl
            })
            await url.save()
            res.json({
                "longUrl": url.initial,
                "shortUrl": publicIdEncode(url.index, url.uuid)
            })
        }
    } catch (err) {
        console.log(err)
        res.status(500).json('Server Error')
    }
});

module.exports = router;