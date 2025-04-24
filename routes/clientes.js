const express = require("express");
const router = express.Router();
const { connectDB } = require("../database");

// Ruta para agregar un cliente de prueba (esto crea la colección si no existe)
// Ruta para mostrar el formulario de agregar cliente
router.get("/crear", (req, res) => {
    res.render("crearCliente", { titulo: "Agregar Cliente" });
});
  
  
// Clientes mayores de 30 años, mostrando solo nombre y correo
router.get("/mayores", async (req, res) => {
  const db = await connectDB();
  const clientes = await db
    .collection("clientes")
    .find({ edad: { $gt: 30 } }, { projection: { nombre: 1, correo: 1, _id: 0 } })
    .toArray();

  res.render("clientes", { clientes, titulo: "Clientes mayores de 30" });
});

// Ruta para procesar la creación de un cliente
router.post("/crear", async (req, res) => {
    const db = await connectDB();
    const cliente = {
      nombre: req.body.nombre,
      correo: req.body.correo,
      edad: req.body.edad,
      ciudad: req.body.ciudad,
    };
  
    // Insertamos el cliente
    const result = await db.collection("clientes").insertOne(cliente);
    res.redirect("/clientes"); // Redirige a la lista de clientes
});
  
// Ruta para mostrar el listado de clientes
router.get("/", async (req, res) => {
    const db = await connectDB();
    const clientes = await db.collection("clientes").find().toArray();
    res.render("clientes", { clientes, titulo: "Listado de Clientes" });
});

const { ObjectId } = require("mongodb");

// Mostrar formulario con datos del cliente
router.get("/actualizar/:id", async (req, res) => {
  const db = await connectDB();
  const cliente = await db.collection("clientes").findOne({ _id: new ObjectId(req.params.id) });
  res.render("editarCliente", { cliente });
});

// Procesar el formulario de actualización
router.post("/actualizar/:id", async (req, res) => {
  const db = await connectDB();
  const { nombre, correo, edad, ciudad } = req.body;

  await db.collection("clientes").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { nombre, correo, edad: parseInt(edad), ciudad } }
  );

  res.redirect("/clientes");
});

router.get("/eliminar/:id", async (req, res) => {
    const db = await connectDB();
    await db.collection("clientes").deleteOne({ _id: new ObjectId(req.params.id) });
    res.redirect("/clientes");
});
  
  
module.exports = router;
