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

// RUTAS CRUD //

// Consultar todos los productos ------------------

app.get("/productos/", function (req, res) {
  db.collection("productos")
    .find()
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

//Añadir producto ---------------------------------

app.post("/nuevo_producto/", function (req, res) {
  const nuevoProducto = req.body;
  db.collection("productos").insertOne(nuevoProducto, function (err, datos) {
    if (err !== null) {
      res.send(err);
    } else {
      res.send(datos);
    }
  });
});

//Editar producto ---------------------------------

app.put("/editar_producto/", function (req, res) {
  const editarProducto = {
    nombre: req.body.nombre,
    precio: req.body.precio,
    grosores: req.body.grosores,
    tallas: req.body.tallas,
    design: req.body.design,
    conception: req.body.conception,
    confort: req.body.confort,
    imagenes: req.body.imagenes,
  };
  db.collection("productos").updateOne(
    { nombre: editarProducto.nombre },
    {
      $set: {
        precio: editarProducto.precio,
        grosores: editarProducto.grosores,
        tallas: editarProducto.tallas,
        design: editarProducto.design,
        conception: editarProducto.conception,
        confort: editarProducto.confort,
        imagenes: editarProducto.imagenes,
      },
    },
    function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    }
  );
});

//Borrar producto ---------------------------
app.delete("/borrar_producto/", function (req, res) {
  const nombre = req.body.nombre;
  db.collection("productos").deleteOne(
    { nombre: nombre },
    function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    }
  );
});

app.listen(3001);
