const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.accestocken;

app.get('/', async (req, res) => {
    const contactsEndpoint = 'https://api.hubspot.com/crm/v3/objects/contacts?limit=10&properties=age,gametag,gamer_platform,firstname,lastname,email&archived=false';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };
    try {
        const resp = await axios.get(contactsEndpoint, { headers });
        const contacts = resp.data.results;
        console.log(contacts)
        res.render('homepage', { title: 'Contacts', contacts });
    } catch (error) {
        console.error(error);
    }
});


app.listen(3000, () => console.log('Listening on http://localhost:3000'));