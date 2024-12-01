const express = require('express');
const databaseFunctions = require('./database');
const app = express();
const port = 6969;


console.clear();



app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/receive-data', (req, res) => {
    const receivedData = req.body;
    console.log('Received data:', receivedData);
    
    res.json({ message: 'Data received successfully', data: receivedData });
});
app.post('/create-collage', async (req, res) => {
    const { name, location, banner_image, rating } = req.body;
    try {
        await databaseFunctions.viewAllCollages();
        await databaseFunctions.viewAllCollages();
        await databaseFunctions.createCollagesTable();
        await databaseFunctions.createCollage(name, location, banner_image, rating);
        res.json({ message: `Created ${name} Collage successfully` });
    } catch (error) {
        console.error('Error creating collage:', error.message);
        res.status(500).json({ message: 'Error creating collage' });
    }
});
app.post('/delete-collage', async (req, res) => {
    const { name } = req.body;
    try {
        await databaseFunctions.viewAllCollages();
        await databaseFunctions.viewAllCollages();
        await databaseFunctions.createCollagesTable();
        await databaseFunctions.deleteCollage(name);
        res.json({ message: `Deleted ${name} Collage successfully` });
    } catch (error) {
        console.error('Error deleting collage:', error.message);
        res.status(500).json({ message: 'Error deleting collage' });
    }
});
// delete collage
// Sample JSON to create a collage
/*
{
    "name": "Art Collage",
    "location": "New York",
    "banner_image": "http://example.com/banner.jpg",
    "rating": 4.5
}
*/
// list all collages
app.get('/collages', async (req, res) => {
    try {
        // view all tables
        await databaseFunctions.viewAllCollages().then((collages) => {
            res.json(collages);
        });
    } catch (error) {
        console.error('Error getting collages:', error.message);
        res.status(500).json({ message: 'Error getting collages' });
    }
});




async function main() {
    try {
        await databaseFunctions.checkAndCreateDatabase();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log('Error connecting to database:', error);
    }
}

main();