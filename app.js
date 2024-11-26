// const express = require('express');
// const app = express();
// const PORT = 3000;

// app.get('/', (req, res) => {
//     res.send('Hello, Kubernetes! This is an updated dummy app.');
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require('express');
const client = require('prom-client');
const app = express();

const register = new client.Registry();

// Example metric: Counter for requests
const counter = new client.Counter({
  name: 'nodejs_app_requests_total',
  help: 'Total number of requests'
});

// Expose metrics at /metrics
app.get('/metrics', async (req, res) => {
  counter.inc(); // Increment the counter for each request
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
