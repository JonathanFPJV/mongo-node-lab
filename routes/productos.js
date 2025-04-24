const express = require("express");
const router = express.Router();
const { connectDB } = require("../database");
const { ObjectId } = require("mongodb");

router.get("/", async (req, res) => {
  const db = await connectDB();
  const productos = await db.collection("productos").find().toArray();
  res.render("index", { productos });
});

router.post("/crear", async (req, res) => {
  const db = await connectDB();
  const { nombre, precio, stock } = req.body;
  await db.collection("productos").insertOne({ nombre, precio: Number(precio), stock: Number(stock) });
  res.redirect("/");
});

// Ruta para mostrar formulario de edición
router.get("/editar/:id", async (req, res) => {
    const db = await connectDB();
    const producto = await db.collection("productos").findOne({ _id: new ObjectId(req.params.id) });
    res.render("editar", { producto });
  });
  
  // Ruta para actualizar el producto
  router.post("/editar/:id", async (req, res) => {
    const db = await connectDB();
    const { nombre, precio, stock } = req.body;
    await db.collection("productos").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { nombre, precio: parseFloat(precio), stock: parseInt(stock) } }
    );
    res.redirect("/");
  });

router.post("/eliminar", async (req, res) => {
  const db = await connectDB();
  const { id } = req.body;
  await db.collection("productos").deleteOne({ _id: new ObjectId(id) });
  res.redirect("/");
});

module.exports = router;
