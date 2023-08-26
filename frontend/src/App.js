import React, { useEffect, useState } from 'react';
import './App.css';
import Title from './Title';
import Paragraph from './Paragraph';
import data from './personajes.json';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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

      // Calcula el rango de IDs disponibles
      const idRange = data.personajes.map((personajes) => personajes.idPersonajes);
      
      // Genera un número aleatorio dentro del rango de IDs
      const randomIndex = Math.floor(Math.random() * idRange.length);
      const randomId = idRange[randomIndex];
      
      // Encuentra el personaje con el ID aleatorio
      const personajeCargado = data.personajes.find((personajes) => personajes.idPersonajes === randomId);
      setPersonajePorId(personajeCargado);
  }, []);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);
    
    const personajesCoincidentes = personajeLista.filter(personaje =>
      personaje.Nombre.toLowerCase().includes(inputValue.toLowerCase())
    );
    
    setPersonajesCoincidentes(personajesCoincidentes);
    setShowError(false);
  };

  const verificarNombre = () => {
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
    const inputValueName = event.target.value;
    setInputValueName(inputValueName);
  };

  // Hook nombre de usuario
  const handleUsernameSubmit = () => {
    console.log("Valor del nombre: ", inputValueName)
    setShowModal(false);
  };

  return (
    <div className='App'>
      <div className='stripe'></div>

      <div className={`overlay ${showModal ? 'show' : ''}`}></div>
      {showModal && (
        <div className='modal'>
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
        <p
          className='help'
          data-tooltip='Este es el contenido del popup'
        >
          ?<span className="tooltip">El juego consiste en adivinar el personaje seleccionado del día. Para empezar has de escribir un personaje en la barra de búsqueda, si las carácteristicas de el personaje que has escrito coinciden con las del personaje seleccionado estas se marcarán en verde. Si las caracteristicas no coinciden estas se marcarán en rojo. Mucha suerte!!</span>
        </p>
      </div>
      <Paragraph />

      <div className='containerStyle'>
      {hasWon ? (
        <p className='errorText'>¡Has ganado!</p>
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
    </div>
  );
}

export default App;