// BUDGET API
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4200;
const fs = require('fs');


// app.use('/', express.static('public'));
app.use(cors());

app.get('/budget', (req, res) => {
    const filePath = `${__dirname}/budgetData.json`;

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading budget data');
        }
        const budget = JSON.parse(data);
        res.json(budget);
    });
});


app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});