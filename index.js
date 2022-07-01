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


        // serveing billing listing along with search result
        app.get('/api/billing-list', verifyJwt, async (req, res) => {
            const pageNum = parseInt(req.query.pageNum)
            let result = await billCollection.find().skip(pageNum * 10).limit(10).toArray()
            res.send(result)
        })

        // searching data

        app.post('/api/billing-list', verifyJwt, async (req, res) => {
            let result;
            const searchQuery = req.body
            const name = searchQuery.name
            const email = searchQuery.email
            const phone = searchQuery.phone
            if (name) {
                result = await billCollection.find({ name }).toArray()
            }
            else if (email) {
                result = await billCollection.find({ email }).toArray()
            }
            else if (phone) {
                result = await billCollection.find({ phone }).toArray()
            }

            res.send(result)
        })

        // uploading billing info
        app.post('/api/add-billing', verifyJwt, async (req, res) => {
            const result = await billCollection.insertOne(req.body)
            res.send(result)
        })


        // updating billing info
        app.patch('/api/update-billing/:id', verifyJwt, async (req, res) => {
            const { name, email, phone, bill } = req.body
            const updateDoc = {
                $set: {
                    name,
                    email,
                    phone,
                    bill
                },
            };
            const result = await billCollection.updateOne({ _id: ObjectId(req.params.id) }, updateDoc)
            res.send(result)
        })




        // updating billing info
        app.delete('/api/delete-billing/:id', verifyJwt, async (req, res) => {
            const result = await billCollection.deleteOne({ _id: ObjectId(req.params.id) })
            res.send(result)
        })

        // serving document size info 
        app.get('/api/total-billings-docs', verifyJwt, async (req, res) => {
            const count = await billCollection.countDocuments()
            res.send({ count })
        })
        app.get('/api/total-paid', verifyJwt, async (req, res) => {
            let total = 0
            const count = await (await billCollection.find().toArray()).map(b => b.bill)
            for (let i = 0; i < count.length; i++) {
                total += count[i]
            }
            res.send({ total })
        })

    }
    finally {
    }
}
run().catch(console.dir);

app.listen(port)