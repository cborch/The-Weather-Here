console.log("called main.js")

let lat, long;
const button = document.getElementById('checkIn');
button.addEventListener('click', async event => {
    const mood = document.getElementById('favColor').value;

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
    navigator.geolocation.getCurrentPosition(position => {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    console.log(lat, long);
    document.getElementById('latitude').textContent = lat;
    document.getElementById('longitude').textContent = long;
    });
} else {
    console.log('geolocation not available');
}