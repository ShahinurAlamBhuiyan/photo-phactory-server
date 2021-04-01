const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()


const port = process.env.PORT || 5055;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7wr7p.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const photoCollection = client.db("photoPhactory").collection("addedPhotos");
  const ordersCollection = client.db("photoPhactory").collection("checkout");
  console.log('database connected')

  app.get('/photos', (req, res) => {
    photoCollection.find()
      .toArray((err, items) => {
        res.send(items)
        console.log('form database', items)
      })
  })


  app.get('/photo/:id', (req, res) => {
    photoCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })
  app.get('/ordered', (req, res) => {
    console.log(req.query.email)
    ordersCollection.find({email : req.query.email})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  app.post('/addPhotos', (req, res) => {
    const newPhoto = req.body;
    photoCollection.insertOne(newPhoto)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.post('/addCheckout', (req, res) => {
    const newCheckout = req.body;
    ordersCollection.insertOne(newCheckout)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    photoCollection.deleteOne({ _id: ObjectID(req.params.id) })
      .then(result => {
        console.log(result)
      })
  })

});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})