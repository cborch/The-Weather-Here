
const express = require('express')
const app = express()
const Datastore = require('nedb')
const fetch = require('node-fetch')


app.listen(3000, () => console.log('listening at 3000'))

app.use(express.static('public'))
app.use(express.json({ limit: '1mb' }))


const database = new Datastore('database.db')
database.loadDatabase()


app.post('/api', (request, response) => {
    //console.log(request.body)
    const data = request.body
    const timestamp = Date.now()
    data.timestamp = timestamp
    database.insert(data)
    response.json(data)
})

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.sendStatus()
            return
        } else {
            response.json(data)
        }
        
    })
})


// Here we are creating a proxy server to Dark Sky API
// In addition we are making a call to openaq for air quality data 
app.get('/weather/:latlong', async (request, response) => {
    console.log(request.params)
    const latlong = request.params.latlong.split(',')
    console.log(latlong)
    const lat = latlong[0]
    const long = latlong[1]
    const weatherURL = `https://api.darksky.net/forecast//${lat},${long}`
    const weatherResponse = await fetch(weatherURL)
    const weatherJSON = await weatherResponse.json()

    const aqURL = `https://api.openaq.org/v2/measurements?coordinates=${lat},${long}`
    console.log(aqURL)
    const aqResponse = await fetch(aqURL)
    const aqJSON = await aqResponse.json()

    const data = {
        weather: weatherJSON,
        airQuality: aqJSON
    }
    response.json(data)
})
