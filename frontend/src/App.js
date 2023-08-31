import React, { useEffect, useState } from 'react';
import './App.css';
import Title from './Title';
import Paragraph from './Paragraph';
import data from './personajes.json';
import axios from 'axios';
import CountdownClock from './CountdownClock';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCrown, faRankingStar, faQuestion, faCopy, faShare, faEnvelope } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [personajeLista, setPersonajeLista] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [inputValueName, setInputValueName] = useState(""); // para guardar el nombre de usuario
  const [personajePorId, setPersonajePorId] = useState(null);
  const [tablasFiltradas, setTablasFiltradas] = useState([]);
  const [personajesComparados, setPersonajesComparados] = useState(new Set()); // Conjunto para almacenar personajes comparados
  const [showError, setShowError] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [personajesCoincidentes, setPersonajesCoincidentes] = useState([]);
  const [posicion, setPosicion] = useState(0); // para mostrar el ranking del jugador cuando acierte
  const [ranking, setRanking] = useState([]);  // para guardar el ranking del día
  const [errorMessage, setErrorMessage] = useState('');
  const [comparacionCaracteristicas, setComparacionCaracteristicas] = useState([]);

  const lastFiveSize = comparacionCaracteristicas.length > 5
  ? comparacionCaracteristicas.length - 5
  : 0;
  
  const greenSquareEmoji = '🟩'; // Emoji de cuadrado verde
  const redSquareEmoji = '🟥'; 

  const generateEmojiMatrix = () => {
    const reversedComparacionCaracteristicas = comparacionCaracteristicas.slice(-5).reverse();
    
    return reversedComparacionCaracteristicas.map((fila) =>
      fila.map((coincide) => (coincide ? greenSquareEmoji : redSquareEmoji))
    );
  };

  const quizmizurl = "https://quizmizdle-4652a.web.app/";

  const handleCopyClick = () => {
    try {
      const tempElement = document.createElement("textarea");
      tempElement.value = divContent2; // Usamos divContent2, que es un string de texto
  
      document.body.appendChild(tempElement);
      tempElement.select();
      document.execCommand("copy");
      document.body.removeChild(tempElement);
  
      alert("Contenido copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  const divContent2 = `
He encontrado el campeón de #Quizmizdle en ${intentos} intentos ☝️🤓
${generateEmojiMatrix().map((row) => row.join(' ')).join('\n')} + ${lastFiveSize} intentos
Visita: ${quizmizurl}
  `;

  const handleWhatsAppClick = () => {
    const encodedContent = encodeURIComponent(divContent2);
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodedContent}`;
    window.open(whatsappURL);
  };

  useEffect(() => {
    setPersonajeLista(data.personajes);

    // Obtener el personaje aleatorio del almacenamiento local
    const storedCharacter = JSON.parse(
      localStorage.getItem("selectedCharacter")
    );

    if (
      storedCharacter &&
      isSameDay(new Date(storedCharacter.date), new Date())
    ) {
      setPersonajePorId(storedCharacter.character);
    } else {
      // Generar un personaje aleatorio
      const randomIndex = Math.floor(Math.random() * data.personajes.length);
      const randomCharacter = data.personajes[randomIndex];

      // Guardar el personaje aleatorio y la fecha actual en el almacenamiento local
      const selectedCharacter = {
        character: randomCharacter,
        date: new Date().toISOString(),
      };
      localStorage.setItem(
        "selectedCharacter",
        JSON.stringify(selectedCharacter)
      );
      setPersonajePorId(randomCharacter);
    }

    cargaRanking();
  }, []);

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  //Para cargar ranking
  const cargaRanking = async () => {
    try {
      const response = await axios.get(
        `https://quismizdle.onrender.com/jugadores/ranking`
      );
      setRanking(response.data);
      console.log("Esto devuelve el res: ", response.data);
    } catch (error) {
      console.error("Error al agregar jugador:", error);
    }
  };

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    const personajesCoincidentes = personajeLista.filter((personaje) =>
      personaje.Nombre.toLowerCase().includes(inputValue.toLowerCase())
    );

    setPersonajesCoincidentes(personajesCoincidentes);
    setShowError(false);
  };

  const verificarNombre = async () => {
    const personajeEncontrado = personajeLista.find(
      (personaje) => personaje.Nombre === inputValue
    );

    if (
      personajeEncontrado &&
      !personajesComparados.has(personajeEncontrado.idPersonajes)
    ) {
      const todasLasCaracteristicasCoinciden =
        personajeEncontrado.Nombre === personajePorId.Nombre &&
        personajeEncontrado.Genero === personajePorId.Genero &&
        personajeEncontrado.Especie === personajePorId.Especie &&
        personajeEncontrado.Ocupación === personajePorId.Ocupación &&
        personajeEncontrado.Serie === personajePorId.Serie &&
        personajeEncontrado.Categoría === personajePorId.Categoría;

      const caracteristicasCoincidentes = [
        personajeEncontrado.Nombre === personajePorId.Nombre,
        personajeEncontrado.Genero === personajePorId.Genero,
        personajeEncontrado.Especie === personajePorId.Especie,
        personajeEncontrado.Ocupación === personajePorId.Ocupación,
        personajeEncontrado.Serie === personajePorId.Serie,
        personajeEncontrado.Categoría === personajePorId.Categoría,
      ];

      setComparacionCaracteristicas((prevComparacion) => [...prevComparacion, caracteristicasCoincidentes]);

      if (todasLasCaracteristicasCoinciden) {
        setHasWon(true);
        try {
          const response = await axios.put(
            `https://quismizdle.onrender.com/jugadores/intentos/${localStorage.getItem(
              "userId"
            )}`,
            { intentos: intentos + 1 }
          );

          console.log("Esto devuelve el res: ", response.data);
        } catch (error) {
          console.error("Error al agregar jugador:", error);
        }
        try {
          const response = await axios.get(
            `https://quismizdle.onrender.com/jugadores/ranking/${localStorage.getItem(
              "userId"
            )}`
          );
          setPosicion(response.data.posicion);
          console.log("Esto devuelve el res: ", response.data);
        } catch (error) {
          console.error("Error al agregar jugador:", error);
        }
        cargaRanking();
      }

      setIntentos(intentos + 1);

      const nuevaTablaFiltrada = (
        <div key={tablasFiltradas.length} className="carta">
          <table className="tabla">
            <thead>
              <tr>
                <th>Personaje</th>
                <th>Genero</th>
                <th>Especie</th>
                <th>Ocupación</th>
                <th>Serie</th>
                <th>Categoría</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  className={
                    personajeEncontrado.Nombre === personajePorId.Nombre
                      ? "green-background"
                      : ""
                  }
                >
                  {personajeEncontrado.Nombre}
                </td>
                <td
                  className={
                    personajeEncontrado.Genero === personajePorId.Genero
                      ? "green-background"
                      : ""
                  }
                >
                  {personajeEncontrado.Genero}
                </td>
                <td
                  className={
                    personajeEncontrado.Especie === personajePorId.Especie
                      ? "green-background"
                      : ""
                  }
                >
                  {personajeEncontrado.Especie}
                </td>
                <td
                  className={
                    personajeEncontrado.Ocupación === personajePorId.Ocupación
                      ? "green-background"
                      : ""
                  }
                >
                  {personajeEncontrado.Ocupación}
                </td>
                <td
                  className={
                    personajeEncontrado.Serie === personajePorId.Serie
                      ? "green-background" 
                      : ""
                  }
                >
                  {personajeEncontrado.Serie}
                </td>
                <td
                  className={
                    personajeEncontrado.Categoría === personajePorId.Categoría
                      ? "green-background"
                      : ""
                  }
                >
                  {personajeEncontrado.Categoría}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      setTablasFiltradas([...tablasFiltradas, nuevaTablaFiltrada]);
      setPersonajesComparados(
        new Set(personajesComparados).add(personajeEncontrado.idPersonajes)
      );
    } else {
      setShowError(true);
    }
  };

  // Reacargamos el nombre del usuario
  const handleInputNameChange = (event) => {
    console.log("Entra cambio de nombre");
    const inputValueName = event.target.value;
    setInputValueName(inputValueName);
    setErrorMessage('');
  };

  // Hook nombre de usuario
  const handleUsernameSubmit = async () => {
    if (inputValueName.trim() !== '') {
      console.log("Valor del nombre: ", inputValueName);
      try {
        const response = await axios.post(
          "https://quismizdle.onrender.com/agregarJugador",
          {
            nombre: inputValueName,
          }
        );

        console.log("Esto devuelve el res: ", response.data.jugador._id);
        localStorage.setItem("userId", response.data.jugador._id);
        console.log("ID local storage: ", localStorage.getItem("userId"));
      } catch (error) {
        console.error("Error al agregar jugador:", error);
      }
      setShowModal(false);
    } else {
      setErrorMessage("No puedes dejar el campo en blanco.");
    }
  };

  return (
    <div className="App">
      <div className="stripe"></div>

      <div className={`overlay ${showModal ? "show" : ""}`}></div>
      {showModal && (
        <div className="modal">
          <h2 className="titulopopup">Bienvenido a Quizmizdle!!</h2>
          {/* <h3 className='parag'>Ingresa tu Nombre de Usuario</h3>
          <input
          className='textBoxName'
            type='text'
          /> */}
          <input
            type="text"
            placeholder="Ingresa tu Nombre de Usuario"
            className="textBoxName"
            value={inputValueName}
            onChange={handleInputNameChange}
          ></input>
          <button className="buttonStyleName" onClick={handleUsernameSubmit}>
            Guardar
          </button>
          <p className='errorText2'>{errorMessage}</p>
        </div>
      )}

      <Title />
      <div className="containerStyle">
        <p className="intentos">Intentos: {intentos}</p>
        <p className="mail">
          <a href="mailto:quizmizdevs@gmail.com" data-tooltip="Este es el contenido del popup">
             <FontAwesomeIcon icon={faEnvelope} className="mailicon" /> 
          </a>
          <span className="tooltipMail">
            Envíanos sugerencias por correo 
          </span>
        </p>
        <p className="rank">
          <a href="#ranking-section" data-tooltip="Este es el contenido del popup">
            <FontAwesomeIcon icon={faRankingStar} className="rankicon" />
          </a>
          <span className="tooltipRank">
            Ranking de usuarios con menos intentos
          </span>
        </p>
        <p className="help" data-tooltip="Este es el contenido del popup">
          <FontAwesomeIcon icon={faQuestion} />
          <span className="tooltip">
            El juego consiste en adivinar el personaje seleccionado del día.
            Para empezar has de escribir un personaje en la barra de búsqueda,
            si las carácteristicas de el personaje que has escrito coinciden con
            las del personaje seleccionado estas se marcarán en verde. Si las
            caracteristicas no coinciden estas se marcarán en rojo. Mucha
            suerte!!
          </span>
        </p>
      </div>
      <Paragraph />

      <div className="containerStyle">
        {hasWon ? (
          <div className="winCard">
            <p className="winText">¡Has ganado!</p>
            <p className='resultadowin'>
              Posición actual en
              <br></br> el ranking #{posicion}
            </p>
            <p className="barra">Próximo personaje</p>
            <CountdownClock />
            <a href="mailto:correo@example.com">Enviar sugerencias por correo</a>
            {comparacionCaracteristicas.length > 0 && (
              <div className='tablaResultados'>
                <table className="comparacion-table">
                  <tbody>
                    {comparacionCaracteristicas.slice(-5).reverse().map((caracteristicas, index) => (
                      <tr key={index}>
                        {caracteristicas.map((coincide, caracteristicaIndex) => (
                          <td
                            key={caracteristicaIndex}
                            className={coincide ? "green-cell" : "red-cell"}
                          >
                            {coincide ? "" : ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <p className='lastFive'>+ {lastFiveSize} intentos</p>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button className="shareButtonStyle" onClick={handleCopyClick}><FontAwesomeIcon icon={faCopy}/> Copiar</button>
              <button className="shareButtonStyle" onClick={handleWhatsAppClick}><FontAwesomeIcon icon={faShare}/> Compartir</button>
            </div>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Escribe el nombre de un personaje animado"
              className="textBoxStyle"
              value={inputValue}
              onChange={handleInputChange}
            ></input>
            <button className="buttonStyle" onClick={verificarNombre}>
              <FontAwesomeIcon icon={faPaperPlane} className="iconStyle" />
            </button>
          </>
        )}
      </div>

      {inputValue && personajesCoincidentes.length > 0 && (
        <div className="containerStyle">
          <ul className="listapersonajes">
            {personajesCoincidentes.map((personaje) => (
              <li
                key={personaje.idPersonajes}
                className="encontrados"
                onClick={() => {
                  setInputValue(personaje.Nombre);
                  setPersonajesCoincidentes([]);
                }}
              >
                {personaje.Nombre}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showError && (
        <div className="error">
          <p className="errorText">No se ha encontrado el personaje</p>
        </div>
      )}

      {tablasFiltradas
        .slice()
        .reverse()
        .map((tabla) => tabla)}

      <h2 className="titrank">
        <FontAwesomeIcon icon={faCrown} className="corona" /> Ranking Diario
      </h2>

      <div className="ranking" id="ranking-section">
        {/* Ranking */}
        <table className="paper-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Intentos</th>
            </tr>
          </thead>
          <tbody>
          {ranking.map(jugador => (
            <tr key={jugador._id}>
              <td>{jugador.nombre}</td>
              <td>{jugador.intentos}</td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;