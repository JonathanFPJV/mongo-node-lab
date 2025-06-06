const express = require("express");
const router = express.Router();
const { connectDB } = require("../database");

// Ruta para agregar un cliente de prueba (esto crea la colección si no existe)
// Ruta para mostrar el formulario de agregar cliente
router.get("/crear", (req, res) => {
    res.render("crearCliente", { titulo: "Agregar Cliente" });
});
  
  
router.get('/filtro-edad', async (req, res) => {
    const minEdad = parseInt(req.query.minEdad);
  
    try {
      const db = await connectDB();
      const clientes = await db.collection("clientes")
        .find(
          { edad: { $gt: minEdad } },
          { projection: { nombre: 1, correo: 1, ciudad: 1, edad: 1 } }
        )
        .toArray();
  
      res.render('clientes', {
        titulo: `Clientes mayores de ${minEdad} años`,
        clientes
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error al obtener los clientes filtrados');
    }
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

// Actualizar solo la ciudad de un cliente por ID
router.post("/actualizar-ciudad/:id", async (req, res) => {
    const db = await connectDB();
    const { ciudad } = req.body;
  
    await db.collection("clientes").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ciudad } }
    );
  
    res.json({ success: true });
});
  
// Actualizar ciudad para todos los que viven en una ciudad específica
router.post("/actualizar-todos", async (req, res) => {
    const db = await connectDB();
    const { ciudadActual, nuevaCiudad } = req.body;
  
    await db.collection("clientes").updateMany(
      { ciudad: ciudadActual },
      { $set: { ciudad: nuevaCiudad } }
    );
  
    res.redirect("/clientes");
});

// Eliminar todos los clientes de una ciudad específica
router.post("/eliminar-todos", async (req, res) => {
    const db = await connectDB();
    const { ciudad } = req.body;
  
    await db.collection("clientes").deleteMany({ ciudad });
    res.redirect("/clientes");
  });
  
  
module.exports = router;
