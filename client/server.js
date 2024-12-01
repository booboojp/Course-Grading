const express = require('express');
const path = require('path');
const app = express();
const port = 4567;

// Middleware to handle CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

async function main() {
    console.clear();
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

main();