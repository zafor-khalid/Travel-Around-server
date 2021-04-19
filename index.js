const express = require('express')
const app = express()
const port = 5000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxiau.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const packagesCollection = client.db("travel-around").collection("packages");
    const confirmedCollection = client.db("travel-around").collection("Bookings");
    const reviewCollection = client.db("travel-around").collection("reviews");
    const adminsCollection = client.db("travel-around").collection("admins");

    app.get('/allPackages', (req, res) => {
        packagesCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })


    app.post('/addPackage', (req, res) => {
        const event = req.body;
        console.log('add', event);
        packagesCollection.insertOne(event)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.post('/confirmBooking', (req, res) => {

        confirmedCollection.insertOne(req.body)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/bookings', (req, res) => {
        console.log(req.query.email)
        confirmedCollection.find({ 'confirmation.email': req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/allbookinglist', (req, res) => {
        confirmedCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.patch('/updatestatus/:id', (req, res) => {
        // console.log(req.params.id)
        confirmedCollection.updateOne({
            _id: ObjectId(req.params.id)
        }, {
            $set:{status: req.body.newStatus}
        })
            .then(function (result) {
                res.send(result.modifiedCount > 0);
            })
    })

    app.post('/addreview', (req, res) => {
        const event = req.body;
        console.log('add', event);
        reviewCollection.insertOne(event)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/allreviews', (req, res) => {
        reviewCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.post('/newadmin', (req, res) => {
        const event = req.body;
        // console.log('add', event);
        adminsCollection.insertOne(event)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/adminlist', (req, res) => {
        adminsCollection.find()
            .toArray((err, items) => {
                res.send(items)
            })
    })

    app.delete('/deletepackage/:id', (req, res) => {
        packagesCollection.deleteOne({
            _id: ObjectId(req.params.id)
        })
            .then(function (result) {
                res.send(result.deletedCount > 0 );
            })
    })


});




app.listen(process.env.PORT || port)