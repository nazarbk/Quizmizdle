const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { ObjectId } = require("mongodb");

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
  intentos: {type: Number, default: 0} 
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
app.put("/jugadores/intentos/:id", async (req, res) => {
  console.log("req body: ", req.body);
  console.log("req params: ", req.params, " y req.params.id: ", typeof req.params.id);
  const playerId = new ObjectId(req.params.id);
  const newIntentos = req.body.intentos;

  const jugador = await Jugador.findById(playerId);

  if (!jugador) {
    return res.status(404).json({ error: "Jugador no encontrado" });
  }

  // Actualizar la puntuación del jugador
  jugador.intentos = newIntentos;

  await jugador.save();

  return res.json({
    message: "Intentos actualizados exitosamente",
    jugador: jugador,
  });
});

//GET /jugadores/ranking: función para devolver el ranking de los jugadores según sus intentos
app.get("/jugadores/ranking", async (req, res) => {
  try {
    const jugadores = await Jugador.find().sort({ intentos: 1 }); // Orden ascendente por intentos
    res.json(jugadores);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});