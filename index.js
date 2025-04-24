const express = require("express");
const { connectDB } = require("./database");
const productosRoutes = require("./routes/productos");
const clientesRoutes = require("./routes/clientes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Rutas
app.use("/", productosRoutes);
app.use("/clientes", clientesRoutes); 

// Iniciar servidor
app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
