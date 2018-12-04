'use strict'
const express = require('express')
const cors = require('cors')
const superagent = require('superagent')



const port = process.env.port ||3000

require('dotenv').config()
const app = express()
process.env.port || 3000

app.use(cors())

app.get('/', (req, res) =>
  res.send('listening to the port port localHost'))

app.get('*', (req, res)=>
  res.send('500 error message'))




app.listen(port, ()=>{
  console.log(`Listening to port ${port}`)
})

app.get('/location', (req, res)=>{
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=${process.env.GOOGLE_API_KEY}`
  superagent.get(url)
    .then(result => {
      res.send({
        longitude: result.body.results[0].geometry.location.lng,
        latitude: result.body.results[0].geometry.location.lat
      })
    })
    .catch(err => res.send('Got an error'))
})
 

