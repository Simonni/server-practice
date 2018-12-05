'use strict'
const express = require('express')
const cors = require('cors')
const superagent = require('superagent')

require('dotenv').config()
const port = process.env.port ||3000
const app = express()
process.env.port || 3000

app.use(cors())

app.get('/', (req, res) =>
  res.send('<h1>listening to the port Simon localHost</h1>'))

app.get('/location', (req, res)=>{
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.address}&key=${process.env.GOOGLE_API_KEY}`
  superagent.get(url)
    .then(result => {
      res.send(new Location(result))
      { lng: result.body.results[0].geometry.location.lng
        lat: result.body.results[0].geometry.location.lat
      }
    })

    .catch(err => res.send(err))
})

app.get('*', (req, res)=>
  res.send('<img src="https://http.cat/404" />'))

app.get('/', (req, res)=>{
  res.send('this is home route')
})

app.use('*', (req, res)=>
  res.send('Something broke'))
app.listen(port, ()=>{
  console.log(`Listening to port ${port}`)
})
const Location = function(loc){
  this.lat = loc.body.results[0].geometry.location.lat
  this.lng = loc.body.results[0].geometry.location.lng
}
