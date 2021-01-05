const express = require("express");

const MongoClient = require("mongodb").MongoClient;
const app = express();

let db;

MongoClient.connect("mongodb://localhost:27017", function (err, client) {
  if (err !== null) {
    console.log(err);
  } else {
    db = client.db("proyecto_k");
  }
});

const cors = require("cors");
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/////////////////////////////////////////////////////////////
// RUTAS
/////////////////////////////////////////////////////////////

//Ruta a la imágenes del proyecto
app.get("/imagenes/", function (req, res) {
  db.collection("imagenes")
    .find()
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

app.listen(3001);
