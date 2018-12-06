'use strict'
const express = require('express')
const cors = require('cors')
const superagent = require('superagent')
const mongoose = require('mongoose')
const { Schema, model } = mongoose

require('dotenv').config()

const mongoURL = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@ds147872.mlab.com:47872/md301`

mongoose.connect(mongoURL)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))

db.once('open', () => {
  console.log('DB connection open!')
})

const app = express()
const port = process.env.port ||3000


app.use(cors())


// app.get('/', (req, res) =>
//   res.send('<h1>listening to the port Simon localHost</h1>'))

app.get('/location', (req, res)=>{
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.address}&key=${process.env.GOOGLE_API_KEY}`
  Location.findOne({ address: req.query.address}, (err, addr) => {
    if(addr) {
      console.log('address found')
      res.send(addr)
    } else {
      superagent.get(url)
        .then(result => {
          const newLocation = new Location({address:req.query.address,
            lng: result.body.results[0].geometry.location.lng,
            lat: result.body.results[0].geometry.location.lat 
          })
          newLocation.save()
          console.log('created new address')
          res.send(newLocation)
        })
    }
  })
  
    .catch(err => res.send(err)) 
})

app.get('*', (req, res)=>
  res.send('<img src="https://http.cat/404" />'))

app.listen(port, ()=>{
  console.log(`Listening to port ${port}`)
})

const LocationSchema = new Schema({
  address: String,
  lat: Number,
  lng: Number
})

const Location = model('Location', LocationSchema)
