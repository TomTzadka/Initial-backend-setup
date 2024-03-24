import express from 'express'
import cookieParser from 'cookie-parser'

import { loggerService } from './services/logger.service.js'
import { bugService } from "./services/bugs.service.js"
// import { utilService } from "./services/utils.service.js"

const app = express()
// Express Config:
app.use(express.static('public'))
app.use(cookieParser())

app.get('/api', (req, res) => {
    // let visitedCount = req.cookies.visitedCount || 0

    
    // res.cookie('visitedCount', ++visitedCount, { maxAge: 60*5 * 1000 })
    // res.send(`<h1>Hello the ${visitedCount}</h1>`)
})


app.get('/api/bugs', (req, res) => {
    // console.log('get all bugs');
    // let cookies = req.cookies
    // console.log(cookies);
    bugService.query()
        .then(bugs => {
            res.send(bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(404).send('Cannot get bugs')
        })
})

app.get('/api/bugs/save', (req, res) => {
    const bugToSave = {
        title: req.query.title,
        severity: +req.query.severity,
        _id: req.query._id
    }
    console.log(`save bug ${bugToSave}`);

    bugService.save(bugToSave)
        .then(bug => res.send(bug))
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})




app.get('/api/bugs/:id', (req, res) => {
    let visitedBugs = req.cookies.visitedBugs || 0
    res.cookie('visitedBugs', ++visitedBugs, { maxAge: 60 * 5 * 1000 })
    
    if(visitedBugs >= 7) return res.status(401).send('Wait for a bit')
    
    const bugId = req.params.id
    bugService.getById(bugId)
        .then(bug => res.send(bug))
        .catch(err => {
            loggerService.error('Cannot get bug id',err)
            res.status(400).send('Cannot get bug id')
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
app.listen(port, () => loggerService.info('Server ready at port 3030'))