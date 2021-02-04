const express = require("express");

const MongoClient = require("mongodb").MongoClient;

//Necesito esta constante para recoger por parámetros la id de los productos en la ruta get para mostar la página de producto único. (línea 143).
const ObjectId = require("mongodb").ObjectId;

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

// RUTAS CRUD PARA EL PANEL DE CONTROL ADMIN //

// Consultar todos los productos ------------------

app.get("/productos", function (req, res) {
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

app.post("/nuevo_producto", function (req, res) {
  const nuevoProducto = req.body;
  db.collection("productos").insertOne(nuevoProducto, function (err, datos) {
    if (err !== null) {
      res.send(err);
    } else {
      // res.send(datos);
      // REFRESCAR EL NAVEGADOR AUTÓMATICAMENTE PARA QUE DESAPAREZCA EL PRODUCTO ELIMNADO
      db.collection("productos")
        .find()
        .toArray(function (err, data) {
          if (err !== null) {
            res.send(err);
          } else {
            res.send(data);
          }
        });
    }
  });
});

//Editar producto ---------------------------------

app.put("/editar_producto", function (req, res) {
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
        // res.send(datos);
        // REFRESCAR EL NAVEGADOR AUTÓMATICAMENTE PARA QUE DESAPAREZCA EL PRODUCTO ELIMNADO
        db.collection("productos")
          .find()
          .toArray(function (err, data) {
            if (err !== null) {
              res.send(err);
            } else {
              res.send(data);
            }
          });
      }
    }
  );
});

//Borrar producto ---------------------------

app.delete("/borrar_producto", function (req, res) {
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

// Ruta para el componente MostrarProducto.js

app.get("/single_product/:nombre", function (req, res) {
  db.collection("productos")
    .find({ nombre: req.params.nombre })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// RUTA PARA MOSTRAR LA PÁGINA DE PRODUCTO ÚNICO USANDO SU id
app.get("/Boutique/:id", function (req, res) {
  const id = ObjectId(req.params.id);
  db.collection("productos")
    .find({ _id: id })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

// RUTAS PARA EL MENÚ HORIZONTAL DE LA PÁGINA "BOUTIQUE EN LIGNE"

// Ruta 1 - Productos para hombre
app.get("/productos_homme", function (req, res) {
  db.collection("productos")
    .find({ genero: "Homme" })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

// Ruta 2 - Productos para mujer
app.get("/productos_femme", function (req, res) {
  db.collection("productos")
    .find({ genero: "Femme" })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

// Ruta 3 - Wetsuits
app.get("/productos_wetsuit", function (req, res) {
  db.collection("productos")
    .find({ tipo: "Wetsuit" })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

// Ruta 4 - Shortys
app.get("/productos_shorty", function (req, res) {
  db.collection("productos")
    .find({ tipo: "Shorty" })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

// Ruta 5 - Tops
app.get("/productos_top", function (req, res) {
  db.collection("productos")
    .find({ tipo: "Top" })
    .toArray(function (err, datos) {
      if (err !== null) {
        res.send(err);
      } else {
        res.send(datos);
      }
    });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////                             P R U E B A S DE F I L T R O S
///////                                    (No están en producción)
////
//

//RUTAS PARA LA PÁGINA "BOUTIQUE EN LIGNE"    --------    PRUEBAS DE  FILTROS      -----------------------

// Consulta de prueba copiando y pegando la ruta desde Robo3/
// OJO. En Robo3T la linea de la ruta es    db.getCollection('productos').find({ $and: [{tipo: "Wetsuit"}, {genero: "Homme"}] })
// Aquí hay que cambiar   db.getCollection.....   por   db.collection......
// app.get("/robo/", function (req, res) {
//   db.collection("productos")
//     .find({ $and: [{ tipo: "Wetsuit" }, { genero: "Homme" }] })
//     .toArray(function (err, datos) {
//       if (err !== null) {
//         res.send(err);
//       } else {
//         res.send(datos);
//       }
//     });
// });

// Para filtrar los valores que deseamos buscar hay que tener en cuenta que .get no puede recibir objetos a través del body, por lo que tiene que recibirlos por parámetros.

// app.get("/:tipo/:genero/", function (req, res) {
//   const tipo = req.params.tipo;
//   const genero = req.params.genero;

//   db.collection("productos")
//     //Ejemplos con $or y $and
//     .find({ $or: [{ tipo: `${tipo}` }, { genero: `${genero}` }] })
//     .find({ $and: [{ tipo: "Wetsuit" }, { genero: "Homme" }] })
//     //Buscando 2 características a la vez
//     .find({ genero: `${genero}`, tipo: `${tipo}` })
//     //Buscando definiendo un texto
//     .toArray(function (err, datos) {
//       if (err !== null) {
//         res.send(err);
//       } else {
//         res.send(datos);
//       }
//     });
// });

app.listen(3001);
