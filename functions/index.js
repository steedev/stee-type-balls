const functions = require('firebase-functions');

const express = require('express')
const path = require('path')

const app = express()

app.use(express.static('type-balls'))


app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname + '/type-balls/dist/index.html'))
})

app.listen(8080, () => console.log('Server start up...'))


exports.app = functions.https.onRequest(app)