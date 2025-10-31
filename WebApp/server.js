const express = require('express');
const { Counter, register } = require('prom-client');

const app = express();
const port = 3000;
const host = '0.0.0.0';

// Prometheus counter for GET / requests
const counter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP GET requests',
    labelNames: ['method', 'endpoint'],
});

// GET / → return Hello World
app.get('/', (req, res) => {
    counter.inc({ method: 'GET', endpoint: '/' });
    res.status(200).send('Hello from The Pod\n');
});

// GET /metrics → return Prometheus metrics
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});

app.listen(port, host, () => {
    console.log(`Server listening at http://${host}:${port}`);
});
