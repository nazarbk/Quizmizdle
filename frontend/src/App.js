import React, { useEffect, useState } from 'react';
import './App.css';
import Title from './Title';
import Paragraph from './Paragraph';
import Axios from 'axios';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [personajeLista, setPersonajeLista] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [personajePorId, setPersonajePorId] = useState(null);
  const [tablasFiltradas, setTablasFiltradas] = useState([]);
  const [personajesComparados, setPersonajesComparados] = useState(new Set()); // Conjunto para almacenar personajes comparados
  const [showError, setShowError] = useState(false);
  const [intentos, setIntentos] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  useEffect(() => {
    Axios.get('http://localhost:3001/personajes').then((response) => {
      setPersonajeLista(response.data);

      // Calcula el rango de IDs disponibles
      const idRange = response.data.map((personaje) => personaje.idPersonajes);
      
      // Genera un número aleatorio dentro del rango de IDs
      const randomIndex = Math.floor(Math.random() * idRange.length);
      const randomId = idRange[randomIndex];
      
      // Encuentra el personaje con el ID aleatorio
      const personajeCargado = response.data.find((personaje) => personaje.idPersonajes === randomId);
      setPersonajePorId(personajeCargado);
      });
  }, []);

  const handleInputChange = (event) => {
    setInputValue(event.target.value); // Restablecer el estado del mensaje al escribir
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
                <th>Habilidad</th>
                <th>Region</th>
                <th>Arma</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className={personajeEncontrado.Nombre === personajePorId.Nombre ? 'green-background' : ''}>{personajeEncontrado.Nombre}</td>
                <td className={personajeEncontrado.Genero === personajePorId.Genero ? 'green-background' : ''}>{personajeEncontrado.Genero}</td>
                <td className={personajeEncontrado.Especie === personajePorId.Especie ? 'green-background' : ''}>{personajeEncontrado.Especie}</td>
                <td className={personajeEncontrado.Habilidad === personajePorId.Habilidad ? 'green-background' : ''}>{personajeEncontrado.Habilidad}</td>
                <td className={personajeEncontrado.Region === personajePorId.Region ? 'green-background' : ''}>{personajeEncontrado.Region}</td>
                <td className={personajeEncontrado.Arma === personajePorId.Arma ? 'green-background' : ''}>{personajeEncontrado.Arma}</td>
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

  return (
    <div className='App'>
      <Title />
      <Paragraph />

      <div className='containerStyle'>
        <p className='intentos'>Intentos: {intentos}</p>
      </div>

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
