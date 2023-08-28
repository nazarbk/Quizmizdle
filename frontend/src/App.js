import React, { useEffect, useState } from 'react';
import './App.css';
import Title from './Title';
import Paragraph from './Paragraph';
import data from './personajes.json';
import axios from 'axios';
import CountdownClock from './CountdownClock';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faCrown, faRankingStar, faQuestion} from '@fortawesome/free-solid-svg-icons';

function App() {
  const [personajeLista, setPersonajeLista] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [inputValueName, setInputValueName] = useState(''); // para guardar el nombre de usuario
  const [personajePorId, setPersonajePorId] = useState(null);
  const [tablasFiltradas, setTablasFiltradas] = useState([]);
  const [personajesComparados, setPersonajesComparados] = useState(new Set()); // Conjunto para almacenar personajes comparados
  const [showError, setShowError] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [hasWon, setHasWon] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [personajesCoincidentes, setPersonajesCoincidentes] = useState([]);

  useEffect(() => {
    setPersonajeLista(data.personajes);

    // Obtener el personaje aleatorio del almacenamiento local
    const storedCharacter = JSON.parse(localStorage.getItem('selectedCharacter'));
    
    if (storedCharacter && isSameDay(new Date(storedCharacter.date), new Date())) {
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
      localStorage.setItem('selectedCharacter', JSON.stringify(selectedCharacter));
      setPersonajePorId(randomCharacter);
    }
  }, []);

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    
    const personajesCoincidentes = personajeLista.filter(personaje =>
      personaje.Nombre.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    setPersonajesCoincidentes(personajesCoincidentes);
    setShowError(false);
  };

  const verificarNombre = async () => {
    const personajeEncontrado = personajeLista.find((personaje) => personaje.Nombre === inputValue);
    
    if (personajeEncontrado && !personajesComparados.has(personajeEncontrado.idPersonajes)) {
      const todasLasCaracteristicasCoinciden = (
        personajeEncontrado.Nombre === personajePorId.Nombre &&
        personajeEncontrado.Genero === personajePorId.Genero &&
        personajeEncontrado.Especie === personajePorId.Especie &&
        personajeEncontrado.Habilidad === personajePorId.Habilidad &&
        personajeEncontrado.Region === personajePorId.Region &&
        personajeEncontrado.Arma === personajePorId.Arma
      );

      if (todasLasCaracteristicasCoinciden) {
        setHasWon(true);
        try {
          const response = await axios
          .put(`http://localhost:3000/jugadores/intentos/${localStorage.getItem('userId')}`, { intentos: intentos });
    
          console.log("Esto devuelve el res: ",response.data);
        } catch (error) {
          console.error('Error al agregar jugador:', error);
        }
      }

      setIntentos(intentos + 1);

      const nuevaTablaFiltrada = (
        <div key={tablasFiltradas.length} className='carta'>
          <table className='tabla'>
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
                <td className={personajeEncontrado.Nombre === personajePorId.Nombre ? 'green-background' : ''}>{personajeEncontrado.Nombre}</td>
                <td className={personajeEncontrado.Genero === personajePorId.Genero ? 'green-background' : ''}>{personajeEncontrado.Genero}</td>
                <td className={personajeEncontrado.Especie === personajePorId.Especie ? 'green-background' : ''}>{personajeEncontrado.Especie}</td>
                <td className={personajeEncontrado.Ocupación === personajePorId.Ocupación ? 'green-background' : ''}>{personajeEncontrado.Ocupación}</td>
                <td className={personajeEncontrado.Serie === personajePorId.Serie ? 'green-background' : ''}>{personajeEncontrado.Serie}</td>
                <td className={personajeEncontrado.Categoría === personajePorId.Categoría ? 'green-background' : ''}>{personajeEncontrado.Categoría}</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

      setTablasFiltradas([...tablasFiltradas, nuevaTablaFiltrada]);
      setPersonajesComparados(new Set(personajesComparados).add(personajeEncontrado.idPersonajes));
      
    } else{
      setShowError(true);
    }
  };

  // Reacargamos el nombre del usuario
  const handleInputNameChange = (event) => {
    console.log("Entra cambio de nombre")
    const inputValueName = event.target.value;
    setInputValueName(inputValueName);
  };

  // Hook nombre de usuario
  const handleUsernameSubmit = async () => {
    console.log("Valor del nombre: ", inputValueName);
    try {
      const response = await axios.post('http://localhost:3000/agregarJugador', {
        nombre: inputValueName,
      });

      console.log("Esto devuelve el res: ",response.data.jugador._id);
      localStorage.setItem('userId', response.data.jugador._id);
      console.log("ID local storage: ", localStorage.getItem('userId'));
    } catch (error) {
      console.error('Error al agregar jugador:', error);
    }
    setShowModal(false);
  };

  return (
    <div className='App'>
      <div className='stripe'></div>

      <div className={`overlay ${showModal ? 'show' : ''}`}></div>
      {showModal && (
        <div className='modal'>
          <h2 className='titulopopup'>Bienvenido a Quizmizdle!!</h2>
          {/* <h3 className='parag'>Ingresa tu Nombre de Usuario</h3>
          <input
          className='textBoxName'
            type='text'
          /> */}
          <input 
            type='text' placeholder='Ingresa tu Nombre de Usuario' className='textBoxName'
            value={inputValueName}
            onChange={handleInputNameChange}
          ></input>
          <button className='buttonStyleName' onClick={handleUsernameSubmit}>Guardar</button>
        </div>
      )}
      
      <Title />
      <div className='containerStyle'>
        <p className='intentos'>Intentos: {intentos}</p>
        <p className='rank'>
        <a href="#ranking-section"><FontAwesomeIcon icon={faRankingStar} className='rankicon'/></a>
        </p>
        <p
          className='help'
          data-tooltip='Este es el contenido del popup'
        >
        <FontAwesomeIcon icon={faQuestion}/><span className="tooltip">El juego consiste en adivinar el personaje seleccionado del día. Para empezar has de escribir un personaje en la barra de búsqueda, si las carácteristicas de el personaje que has escrito coinciden con las del personaje seleccionado estas se marcarán en verde. Si las caracteristicas no coinciden estas se marcarán en rojo. Mucha suerte!!</span>
        </p>
      </div>
      <Paragraph />

      <div className='containerStyle'>
      {hasWon ? (
        <div className='winCard'>
          <p className='winText'>¡Has ganado!</p>
          <p className='barra'>Próximo personaje:</p>
          <CountdownClock/>
        </div>
      ) : (
        <>
          <input 
            type='text' placeholder='Escribe el nombre de un personaje animado' className='textBoxStyle'
            value={inputValue}
            onChange={handleInputChange}
          ></input>
          <button className='buttonStyle' onClick={verificarNombre}>
            <FontAwesomeIcon icon={faPaperPlane} className='iconStyle'/>
          </button>
        </>
      )}
      </div>

      {inputValue && personajesCoincidentes.length > 0 && (
      <div className='containerStyle'>
        <ul className='listapersonajes'>
          {personajesCoincidentes.map(personaje => (
            <li
              key={personaje.idPersonajes}
              className='encontrados'
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
        <div className='error'>
          <p className='errorText'>No se ha encontrado el personaje</p>
        </div>
      )}

      {tablasFiltradas.slice().reverse().map((tabla) => tabla)}

      <h2 className='titrank'><FontAwesomeIcon icon={faCrown} className='corona'/> Ranking Diario</h2>

      <div className='ranking' id="ranking-section">
          {/* Ranking */}
          <table className='paper-table'>
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Intentos</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Juanma</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Jaime</td>
                <td>2</td>
              </tr>
              <tr>
                <td>Quizmiz</td>
                <td>11</td>
              </tr>
              <tr>
                <td>Mario</td>
                <td>19</td>
              </tr>
              <tr>
                <td>Pablico</td>
                <td>19</td>
              </tr>
              <tr>
                <td>Jorge</td>
                <td>24</td>
              </tr>
            </tbody>
          </table>
        </div>
    </div>
  );
}

export default App;