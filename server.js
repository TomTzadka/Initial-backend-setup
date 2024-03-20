import express from 'express'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { bugService } from "./services/bugs.service.js"

const app = express()
// Express Config:
// app.use(express.static('public'))
app.use(cookieParser())

app.get('/', (req, res) => res.send('Hello there Tom!'))


app.get('/api/bugs', (req, res) => {
    console.log('get');
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
})

app.get('/api/bugs/save', (req, res) => {
    return new Promise(res.send('save'))
    
    const bugToSave = {
        vendor: req.query.vendor,
        speed: +req.query.speed,
        desc: req.query.desc,
        _id: req.query._id
    }
    // res.send(req.query)
    // bugService.save(bugToSave)
    //     .then(bug => res.send(bug))
    //     .catch((err) => {
    //         loggerService.error('Cannot save bug', err)
    //         res.status(400).send('Cannot save bug')
    //     })
})




app.get('/api/bugs/:id', (req, res) => {
    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error(err)
            res.status(400).send('Cannot get bug')
        })
})

app.get('/api/bugs/:id/remove', (req, res) => {
    console.log('delete....');
    const bugId = req.params.id
    console.log('req.params',req.params);
    bugService.remove(bugId)
        .then(() => res.send(bugId))
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })
})




const port = 3030
app.listen(port, () => console.log('Server ready at port 3030'))