const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
require("dotenv").config();
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

app.get('/tareas', async (req, res) => {
    try {
        const db = client.db(process.env.MONGO_DB);
        const collection = db.collection(process.env.MONGO_COLLECTION);

        const document = await collection.find().toArray();
        client.close();

        res.json(document);
    } catch (error) {
        console.log("Error en la conexion",error);
        res.status(500).json("Error interno en el servidor");
    }
});

app.post('/tareas', async (req, res) => {
    const post = {
        "name": "Reparar tuberia",
        "level": 8,
        "group": "cocina",
        "completed": false,
        "person": "Fulano"
      }

    try {
        await client.connect();
        const db = client.db(process.env.MONGO_DB);
        const collection = db.collection(process.env.MONGO_COLLECTION);

        const document = await collection.insertOne(post);
        client.close();

        res.json(document);
    } catch (error) {
        console.log("Error en la conexion",error);
        res.status(500).json("Error interno en el servidor");
    }
});

app.delete("/tareas/:id", async (req, res) => {
    try {
      const documentId = req.params.id;
  
      const objectId = new ObjectId(documentId);
  
      await client.connect();
      const db = client.db(process.env.MONGO_DB);
      const collection = db.collection(process.env.MONGO_COLLECTION);
      const document = await collection.deleteOne({ _id: objectId });
  
      client.close();
      res.json(document);
    } catch (error) {
        console.log("Error en la conexion",error);
        res.status(500).json("Error interno en el servidor");
    }
});

app.put("/tareas/:id", async (req, res) => {
    const update = { $set: {
        "name": "Reparar TV",
        "level": 4,
        "group": "sala",
        "completed": true,
        "person": "Zutano"
      }};

    try {
      const documentId = req.params.id;
  
      const objectId = new ObjectId(documentId);
  
      await client.connect();
      const db = client.db(process.env.MONGO_DB);
      const collection = db.collection(process.env.MONGO_COLLECTION);
      const document = await collection.updateOne({ _id: objectId }, update);
  
      client.close();
      res.json(document);
    } catch (error) {
        console.log("Error en la conexion",error);
        res.status(500).json("Error interno en el servidor");
    }
});

app.listen(process.env.port, ()=>{
    console.log('listening on port '+process.env.port);
});