const chai = require('chai');
const expect = chai.expect;
const http = require('http');
const nock = require('nock');
const { statusHandler } = require('./server.js');
const { weatherHandler } = require('./server.js');

describe('statusHandler', () => {
    it('should return a JSON object with a Status property set to "OK"', (done) => {
        const req = new http.IncomingMessage();
        const res = new http.ServerResponse(req);
        res.end = (data) => {
            expect(data).to.be.a('string');
            const json = JSON.parse(data);
            expect(json).to.be.an('object');
            expect(json).to.have.property('Status');
            expect(json.Status).to.equal('OK');
            done();
        };
        statusHandler(req, res);
    });
});

describe('weatherHandler', () => {
    it('should return weather data for Jakarta', (done) => {
        // mock the OpenWeatherMap API response
        nock('https://api.openweathermap.org')
            .get('/data/2.5/weather?q=Jakarta&appid=c7c94c8e7932d656009f92c8263cdf5b&units=metric')
            .reply(200, {
                weather: [
                    {
                        main: 'Clear',
                        description: 'clear sky'
                    }
                ],
                main: {
                    temp: 25.5
                }
            });

        const req = new http.IncomingMessage();
        const res = new http.ServerResponse(req);
        res.end = (data) => {
            expect(data).to.be.a('string');
            const json = JSON.parse(data);
            expect(json).to.be.an('object');
            expect(json).to.have.property('weather');
            expect(json.weather).to.be.an('array');
            expect(json.weather[0]).to.be.an('object');
            expect(json.weather[0]).to.have.property('main');
            expect(json.weather[0].main).to.equal('Clear');
            expect(json.weather[0]).to.have.property('description');
            expect(json.weather[0].description).to.equal('clear sky');
            expect(json).to.have.property('main');
            expect(json.main).to.be.an('object');
            expect(json.main).to.have.property('temp');
            expect(json.main.temp).to.equal(25.5);
            done();
        };
        weatherHandler(req, res);
    });
});