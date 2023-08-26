import React from 'react';
import './App.css';

const Paragraph = () => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center', // Esto centra horizontalmente
        alignItems: 'center',
    }

    const paragraphStyle = {
        padding: '20px',
        width: '230px' ,
        borderRadius: '10px',
        border: '3.5px solid rgb(218, 255, 251)',
        backgroundColor: 'rgb(23, 107, 135)',
        color: 'rgb(218, 255, 251)',
        marginTop: '-12px',
    };

    return(
        <div style={containerStyle}>
            <h3 style={paragraphStyle} className='parag'>¡Adivina el personaje animado del día!</h3>
        </div>
    );
};

export default Paragraph;