import React, {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const TextBox = () => {
    const [hover, setHover] = useState(false);

    const handleMouseEnter = () => {
        setHover(true);
    };

    const handleMouseLeave = () => {
        setHover(false);
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center', // Esto centra horizontalmente
        alignItems: 'center',
    }

    const textBoxStyle = {
        width: '208px',
        height: '30px',
        border: '2px solid #000',
        padding: '5px',
        marginRight: '8px',
        borderRadius: '10px'
    };

    const buttonStyle = {
        padding: '8px',
        fontSize: '21px',
        border: '2px solid #000',
        borderRadius: '10px',
        backgroundColor: hover ? 'green' : 'white',
        transition: 'color 0.5s ease',
    };

    const iconStyles = {
        marginRight: '3px',
        color: hover ? '#ffffff' : '#000000', // Cambia el color del icono
        transition: 'color 0.5s ease', // Transición suave para el cambio de color del icono
    };

    return(
        <div style={containerStyle}>
            <input type='text' placeholder='Escribe el nombre de un personaje animado'style={textBoxStyle}></input>
            <button style={buttonStyle} 
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}>
                <FontAwesomeIcon icon={faPaperPlane} style={iconStyles}/>
            </button>
        </div>
    );
};

export default TextBox;