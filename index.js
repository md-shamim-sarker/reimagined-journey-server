const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middle wares
app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://talha:talha@cluster0.unau3wp.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

async function run() {
    try {
        const servicesCollection = client.db("talhadb").collection("services");
        const reviewsCollection = client.db("talhadb").collection("reviews");

        app.get("/services-limited", async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result);
        });

        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = servicesCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query);
            res.send(service);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
            console.log('Data added successfully...');
        });

        app.get('/reviews/:serviceId', async (req, res) => {
            const serviceId = req.params.serviceId;
            const query = {serviceId: serviceId};
            const sort = {date: -1};
            const cursor = reviewsCollection.find(query).sort(sort);
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/review/:email', async (req, res) => {
            const email = req.params.email;
            const query = {email: email};
            const sort = {date: -1};
            const cursor = reviewsCollection.find(query).sort(sort);
            const result = await cursor.toArray();
            res.send(result);
        });




    } catch(error) {
        console.log(error);
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('running task');
});

app.listen(port, () => {
    console.log(`task running on ${port}`);
});