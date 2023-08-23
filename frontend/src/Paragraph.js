import React from 'react';

const Paragraph = () => {
    const containerStyle = {
        display: 'flex',
        justifyContent: 'center', // Esto centra horizontalmente
        alignItems: 'center',
    }

    const paragraphStyle = {
        padding: '20px',
        borderRadius: '10px 10px 0 0',
        border: '2px solid black',
        width: '220px',
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    };

    return(
        <div style={containerStyle}>
            <h3 style={paragraphStyle}>¡Adivina el personaje animado del día!</h3>
        </div>
    );
};

export default Paragraph;