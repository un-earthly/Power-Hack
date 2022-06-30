const express = require('express')
const cors = require('cors')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
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


        app.get('/api/register', (req, res) => {
            const token = jwt.sign(req.body, process.env.JWT__SECRET)
            res.send({ "token": token })
        })


        /*
                
        login
        register
        
        */

        app.get('/', verifyJwt, async (req, res) => {
            res.send("hello")
        })
    }
    finally {
    }
}
run().catch(console.dir);

app.listen(port)