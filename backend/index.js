const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");
const { ObjectId } = require("mongodb");

mongoose.connect("mongodb+srv://javimgdev:NVLtMNxEicDB08WX@cluster0.cuvzbwo.mongodb.net/"); // localhost 127.0.0.1
let app = express();
app.use(express.json());
app.use(cors());

app.listen(3000, () => {
  console.log("Servidor escuchando en el puerto 3000");
});

app.set('trust proxy', true);

//Modelo de jugador
const jugadorSchema = new mongoose.Schema({
  nombre: String,
  intentos: {type: Number, default: 999} ,
  ip: String,
  cuadrados: {
    type: [[Boolean]], // Tipo de dato: array de arrays de booleanos
    default: [[]],    // Valor por defecto: un array vacío
  }
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

// GET /jugadores: función que devuelve los jugadores de la BD
app.get("/comprobarip", async (req, res) => {
    const ip = req.ip;
    const existingPlayer = await Jugador.findOne({ ip: ip });
    let variable= false
      if (existingPlayer) {
        console.log("IP ya registrada");
        variable= true;
      }
      res.json({
        mensaje: "Get ip correcta",
        ipregistrada: variable,
        jugador: existingPlayer
      });
  
});

// POST /jugadores: función para agregar un nuevo jugador a la BD

app.post("/agregarJugador", async (req, res) => {
  const { nombre} = req.body;
  const ip = req.ip;
  console.log("Este es el req: ", req.body);
  console.log("Esta es la ip: ", req.ip);

  try {
    //Comprobamos si la IP ya está registrada
    const existingPlayer = await Jugador.findOne({ ip: ip });
    if (existingPlayer) {
      console.log("IP ya registrada");
      return res.status(400).json({ message: 'Ya has registrado tu IP anteriormente.' });
    }
    const nuevoJugador = new Jugador({ nombre, ip });
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
  let newCuadrados = req.body.cuadrados;
  const cuadradosCorrectos = [true, true, true, true, true, true];

  const jugador = await Jugador.findById(playerId);

  if (!jugador) {
    return res.status(404).json({ error: "Jugador no encontrado" });
  }

  // Actualizar la puntuación del jugador
  jugador.intentos = newIntentos;
  newCuadrados.push(cuadradosCorrectos);
  jugador.cuadrados = newCuadrados;

  await jugador.save();

  return res.json({
    message: "Intentos actualizados exitosamente",
    jugador: jugador,
  });
});

//PUT /jugadores/cuadrados: función para agregar los cuadrados de cada jugador con sus intentos
// app.put("/jugadores/cuadrados/:id", async (req, res) => {
//   console.log("req body: ", req.body);
//   console.log("req params: ", req.params, " y req.params.id: ", typeof req.params.id);
//   const playerId = new ObjectId(req.params.id);
//   const newCuadrados = req.body.cuadrados;

//   const jugador = await Jugador.findById(playerId);

//   if (!jugador) {
//     return res.status(404).json({ error: "Jugador no encontrado" });
//   }

//   // Actualizar la puntuación del jugador
//   jugador.cuadrados = newCuadrados;

//   await jugador.save();

//   return res.json({
//     message: "Intentos actualizados exitosamente",
//     jugador: jugador,
//   });
// });

//GET /jugadores/ranking: función para devolver el ranking de los jugadores según sus intentos
app.get("/jugadores/ranking", async (req, res) => {
  try {
    const jugadores = await Jugador.find({ intentos: { $lt: 700 } })
      .sort({ intentos: 1 })
      .limit(10); // Orden ascendente por intentos y límite de 10 jugadores
    res.json(jugadores);
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});

//GET /jugadores/ranking: función para devolver el ranking del jugador
app.get("/jugadores/ranking/:id", async (req, res) => {
  try {
    const playerId = req.params.id;
    console.log("req params: ", req.params, " y req.params.id: ", typeof req.params.id);
    const jugadores = await Jugador.find().sort({ intentos: 1 }).limit(10);
    const playerPosition = jugadores.findIndex(player => player._id.toString() === playerId);
    console.log("Posicion ranking: ", playerPosition +1);
    return res.json({
      message: "Intentos actualizados exitosamente",
      posicion: playerPosition + 1
    });
  } catch (error) {
    console.error("Error al obtener jugadores:", error);
    res.status(500).json({ error: "Error al obtener jugadores" });
  }
});

//Personajes
//Modelo de personaje
const personajeSchema = new mongoose.Schema({
  idPersonaje: Number,
  nombre: String ,
  genero: String,
  especie: String,
  ocupacion: String,
  serie: String,
  categoria: String,
  pista: String
});
const Personaje = mongoose.model("Personaje", personajeSchema, "personajes");

// GET /personajes: función que devuelve los personajes de la BD
app.get("/personajes", (req, res) => {
  Personaje.find()
    .then((resultado) => {
      res.status(200).send({ ok: true, resultado: resultado });
    })
    .catch((error) => {
      res.status(500).send({ ok: false, error: "Error obteniendo personajes" });
    });
});

// GET /personajes/idPersonaje función que devuelve el personaje por idPersonaje
app.get("/personajes/:idPersonaje", (req, res) => {
  const idPersonaje = req.params.idPersonaje;
  console.log("LLAMADA ID PERSONAJE: ",req.body);
  Personaje.find({idPersonaje : idPersonaje})
    .then((resultado) => {
      res.status(200).send({ ok: true, resultado: resultado });
    })
    .catch((error) => {
      res.status(500).send({ ok: false, error: "Error obteniendo personajes" });
    });
});

// POST /agregarPersonaje: función para agregar un nuevo personaje a la BD
// SOLO para admins
app.post("/agregarPersonaje", async (req, res) => {
  const { idPersonaje, nombre, genero, especie, ocupacion, serie, categoria} = req.body;
  console.log("Este es el req: ", req.body);
  console.log("Esta es el req.header del admin: ", req.headers['admin']);
  if(req.headers['admin'] == "malni"){
    try {
      const nuevoPersonaje = new Personaje(req.body);
      await nuevoPersonaje.save();
      res.json({
        mensaje: "Personaje agregado exitosamente",
        personaje: nuevoPersonaje,
      });
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: "Error al agregar personaje", error: error.message });
    }
  }
  else{
    console.log("No eres un admin para realizar esta acción");
    return res.status(404).json({ error: "Solo un admin puede realizar esta acción" });
  }
  
});

//Personaje del dia
//Modelo de personaje del dia
const personajeDiaSchema = new mongoose.Schema({
  idPersonaje: Number
});
const PersonajeDia = mongoose.model("PersonajeDia", personajeDiaSchema, "personajeDia");

// GET /personajeDia: función que devuelve el id del personaje del dia
app.get("/personajeDia", (req, res) => {
  PersonajeDia.find()
    .then((resultado) => {
      res.status(200).send({ ok: true, resultado: resultado });
    })
    .catch((error) => {
      res.status(500).send({ ok: false, error: "Error obteniendo personajes" });
    });
});

// Programar la tarea para ejecutar la actualización del personaje cada día
cron.schedule('0 0 * * *', async () => {
  try {
    const numeroAleatorio = Math.floor(Math.random() * 66) + 1;

    const personajeAnt = await PersonajeDia.find();

    // Actualiza el personaje con id=1 en la base de datos cada día
    const resultado = await PersonajeDia.findOneAndUpdate(
      { idPersonaje: personajeAnt.idPersonaje },
      {idPersonaje: numeroAleatorio},
      { new: true }
    );

    console.log('Personaje actualizado con éxito:', resultado);
  } catch (error) {
    console.error('Error al actualizar el personaje:', error);
  }
});

// POST /agregarPersonajeDia: función para agregar un nuevo personaje del dia a la BD
// SOLO para admins
app.post("/agregarPersonajeDia", async (req, res) => {
  //const { idPersonaje} = req.body;
  console.log("Este es el req: ", req.body);
  console.log("Esta es el req.header del admin: ", req.headers['admin']);
  if(req.headers['admin'] == "malni"){
    try {
      const nuevoPersonaje = new PersonajeDia(req.body);
      await nuevoPersonaje.save();
      res.json({
        mensaje: "Personaje del dia agregado exitosamente",
        personajeDia: nuevoPersonaje,
      });
    } catch (error) {
      res
        .status(500)
        .json({ mensaje: "Error al agregar personaje del dia", error: error.message });
    }
  }
  else{
    console.log("No eres un admin para realizar esta acción");
    return res.status(404).json({ error: "Solo un admin puede realizar esta acción" });
  }
  
});