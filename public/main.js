//const { request } = require('express')

console.log("called main.js")

let lat, long;
const button = document.getElementById('checkIn');
button.addEventListener('click', async event => {

    const data = { lat, long };
    const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
    };
    const response = await fetch('/api', options);
    const json = await response.json();
    console.log(json);
});

if ('geolocation' in navigator) {
    console.log('geolocation available');
    navigator.geolocation.getCurrentPosition(async position => {
        try {
            lat = position.coords.latitude;
            long = position.coords.longitude;
            console.log(lat, long);
            document.getElementById('latitude').textContent = lat;
            document.getElementById('longitude').textContent = long;
            // CORS is disabled on Dark Sky, so we can't share the API's resources with client side code
            // - This is in part becuase the API key is part of the request so for security reasons we need to make the request to Dark Sky from our server
            // In this client side code, we will make a request to our server at a new endpoint that we will create that asks our server to make a call to Dark Sky 
            const apiURL = `/weather/${lat},${long}`
            const response = await fetch(apiURL)
            const json = await response.json()
            const weather = json['weather']['currently']
            const aq = json['airQuality']['results'][2]
            document.getElementById('summary').textContent = weather['summary']
            document.getElementById('temperature').textContent = weather['temperature']
            document.getElementById('aqParameter').textContent = aq['parameter']
            document.getElementById('aqValue').textContent = aq['value']
            document.getElementById('aqUnits').textContent = aq['unit']
            const aqDate = new Date(aq['date']['local'])
            document.getElementById('aqDate').textContent = aqDate.toDateString()
            console.log(json)
        } catch (error) {
            console.log('Something went wrong')
        }
    });
} else {
    console.log('geolocation not available');
}