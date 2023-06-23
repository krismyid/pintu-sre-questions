const http = require('http');
const https = require('https');

let weatherData = {
    data: null,
    expires: 0
};

const weatherHandler = (req, res) => {
    // check if the data is still valid
    if (Date.now() < weatherData.expires) {
        // return the cached data
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(weatherData.data));
        return;
    }
    // construct the API URL
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=Jakarta&appid=c7c94c8e7932d656009f92c8263cdf5b&units=metric';
    // make a GET request to the API
    https.get(url, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            // parse the JSON response
            weatherData.data = JSON.parse(data);
            // cache the data for 15 minutes
            weatherData.expires = Date.now() + 15 * 60 * 1000;
            // return the JSON data as the response
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(weatherData.data));
        });
    }).on("error", (err) => {
        res.statusCode = 500;
        res.end("Failed to fetch weather data");
    });
}

const statusHandler = (req, res) => {
    const data = {
        Status: "OK",
        Time: new Date(),
        Engine: "NodeJS Server",
    };
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
}

const server = http.createServer((req, res) => {
    if (req.url === '/weather') {
        weatherHandler(req, res);
    } else if (req.url === '/status') {
        statusHandler(req, res);
    } else {
        res.statusCode = 404;
        res.end();
    }
});

module.exports = {
    statusHandler,
    weatherHandler
};

server.listen(8000, () => {
    console.log('listening on :8000');
});

