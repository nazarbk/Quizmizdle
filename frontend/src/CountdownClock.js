import React, { useState, useEffect } from 'react';

function CountdownClock() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const nextMidnight = new Date();
      nextMidnight.setDate(nextMidnight.getDate() + 1);
      nextMidnight.setHours(0, 0, 0, 0);

      const timeDifference = nextMidnight - now;
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    const interval = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // Actualiza el tiempo restante al montar el componente

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p className='horas'>{timeLeft.hours.toString().padStart(2, '0')}:
         {timeLeft.minutes.toString().padStart(2, '0')}:
         {timeLeft.seconds.toString().padStart(2, '0')}</p>
    </div>
  );
}

export default CountdownClock;
