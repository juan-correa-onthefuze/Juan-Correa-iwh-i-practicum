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

app.get('/create-contact', (req, res) => {
    res.render('create-contact', { title: 'Create Contact' });
});

app.post('/create-contact', async (req, res) => {
    const newContact = {
        properties: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            gametag: req.body.gametag,
            gamer_platform: req.body.gamer_platform,
            email: req.body.email
        }
    };

    const createContactUrl = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createContactUrl, newContact, { headers });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/update-contact', async (req, res) => {
    const contactId = req.query.id;
    const contactUrl = `https://api.hubspot.com/crm/v3/objects/contacts/${contactId}?properties=age,gametag,gamer_platform,firstname,lastname,email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(contactUrl, { headers });
        const contact = resp.data;
        res.render('update-contact', { title: 'Update Contact', contact });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update-contact', async (req, res) => {
    const contactId = req.body.contactId;
    const update = {
        properties: {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            age: req.body.age,
            gametag: req.body.gametag,
            gamer_platform: req.body.gamer_platform,
            email: req.body.email // Add email to the properties object
        }
    };

    const updateContactUrl = `https://api.hubspot.com/crm/v3/objects/contacts/${contactId}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.patch(updateContactUrl, update, { headers });
        console.log('Contact updated:', response.data);
        res.redirect('/');
    } catch (error) {
        console.error('Error updating contact:', error.response.data);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));