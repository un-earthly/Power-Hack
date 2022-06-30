const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const verifyJwt = require('./middlewares/verifyJwt');
const jwt = require('jsonwebtoken');
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 80
require('dotenv').config()


const uri = `mongodb+srv://${process.env.MONGO_ADMIN}:${process.env.MONGO_PASS}@cluster0.d7awh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect();
        const userCollection = client.db("powerHack").collection("user");
        const billCollection = client.db("powerHack").collection("bill");


        /*
        
        login
        register
        
        */


        app.post('/api/register', async (req, res) => {
            const token = jwt.sign(req.body, process.env.JWT__SECRET)
            await userCollection.insertOne(req.body)
            res.send({ token })
        })

        // login


        app.post('/api/login', async (req, res) => {
            const token = jwt.sign(req.body, process.env.JWT__SECRET)
            const user = await userCollection.findOne({ email: req.body.email, pass: req.body.pass })
            if (!user) {
                res.send({ "Error": "User not found" })
            } else {
                res.send({ token })
            }
        })


        /*
                
        login
        register
        
        */


        // serveing billing listing
        app.get('/api/billing-list', verifyJwt, async (req, res) => {
            const result = await billCollection.find().toArray()
            res.send(result)
        })



        // uploading billing info
        app.post('/api/add-billing', verifyJwt, async (req, res) => {
            const result = await billCollection.insertOne(req.body)
            res.send(result)
        })


        // updating billing info
        app.patch('/api/add-billing/:id', verifyJwt, async (req, res) => {
            const result = await billCollection.updateOne({ _id: ObjectId(req.params.id) }, req.body)
            res.send(result)
        })
        
        // updating billing info
        app.delete('/api/add-billing/:id', verifyJwt, async (req, res) => {
            const result = await billCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(result)
        })

    }
    finally {
    }
}
run().catch(console.dir);

app.listen(port)