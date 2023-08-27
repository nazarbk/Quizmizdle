const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

mongoose.connect("mongodb://127.0.0.1:27017/jugadores"); // localhost 127.0.0.1
let app = express();
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});

//Modelo de jugador
const jugadorSchema = new mongoose.Schema({
  nombre: String,
});

const Jugador = mongoose.model("Jugador", jugadorSchema, "jugadores");

// GET /jugadores: función que devuelve los jugadores de la BD
app.get("/jugadores", (req, res) => {
  Jugador.find()
    .then((resultado) => {
      res.status(200).send({ ok: true, resultado: resultado });
    })
    .catch((error) => {
      res.status(500).send({ ok: false, error: "Error obteniendo jugadores" });
    });
});

// POST /jugadores: función para agregar un nuevo jugador a la BD

app.post("/agregarJugador", async (req, res) => {
  const { nombre } = req.body;
  console.log("Este es el req: ", req.body);

  try {
    const nuevoJugador = new Jugador({ nombre });
    await nuevoJugador.save();
    res.json({
      mensaje: "Jugador agregado exitosamente",
      jugador: nuevoJugador,
    });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al agregar jugador", error: error.message });
  }
});

// Programar la tarea para eliminar los jugadores cada 24 horas
cron.schedule("0 0 * * *", async () => {
  try {
    await Jugador.deleteMany({});
    console.log("Se eliminaron todos los jugadores.");
  } catch (error) {
    console.error("Error al eliminar jugadores:", error);
  }
});

//PUT /jugadores/intentos: función para agregar los intentos de cada jugador para hacer ranking

//GET /jugadores/ranking: función para devolver el ranking de los jugadores según sus intentos
