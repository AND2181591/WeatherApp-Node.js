const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geoCode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, './templates/views');
const partialsPath = path.join(__dirname, './templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather app', 
        name: 'Andrew Camacho'
    })
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me', 
        name: 'Andrew Camacho'
    })
});

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.', 
        title: 'Help', 
        name: 'Andrew Camacho'
    })
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geoCode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({
                error: 'Unable to fetch geocode'
            });
        }
        forecast(latitude, longitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: 'Unable to fetch forecast'
                });
            }
    
            res.send({
                forecast: forecastData, 
                location: location, 
                address: req.query.address, 
            });
        });
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'Search term is required'
        })
    }

    res.send({
        products: []
    })
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404', 
        name: 'Andrew Camacho', 
        errorMessage: 'Help article not found.'
    })
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404', 
        errorMessage: 'Page Not Found', 
        name: 'Andrew Camacho'
    })
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});