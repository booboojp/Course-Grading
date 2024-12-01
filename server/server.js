const express = require('express');
const app = express();
const port = 6969;

console.clear();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})

app.post('/receive-data', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    
    // Respond back to the client
    res.json({ message: 'Data received successfully', data: receivedData });
});