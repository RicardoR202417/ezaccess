import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/weatherWidget.css'; // Ruta corregida para importar los estilos.

// Componente funcional para mostrar el clima actual en Querétaro, México.
const WeatherWidget = () => {
  // Estado para almacenar los datos del clima.
  const [weatherData, setWeatherData] = useState(null);
  // Estado para manejar errores en la consulta.
  const [error, setError] = useState(null);

  // API Key directamente en el código (proporcionada por el usuario).
  const apiKey = 'bcccb8c989763d068fc15bfc05e53f9c';

  // Función para obtener los datos del clima desde la API.
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=Queretaro,mx&appid=${apiKey}&units=metric&lang=es`
      );
      setWeatherData(response.data); // Guardamos los datos obtenidos en el estado.
      setError(null); // Reiniciamos el estado de error.
    } catch (err) {
      setError('No se pudo obtener el clima. Por favor, intenta más tarde.');
    }
  };

  // useEffect para realizar la consulta al montar el componente y cada 10 minutos.
  useEffect(() => {
    fetchWeatherData(); // Llamamos a la función al montar el componente.
    const interval = setInterval(fetchWeatherData, 600000); // Actualizamos cada 10 minutos.
    return () => clearInterval(interval); // Limpiamos el intervalo al desmontar el componente.
  }, []);

  // Si hay un error, mostramos un mensaje amigable.
  if (error) {
    return <div className="weather-widget error">{error}</div>;
  }

  // Si los datos aún no están disponibles, mostramos un mensaje de carga.
  if (!weatherData) {
    return <div className="weather-widget loading">Cargando clima...</div>;
  }

  // Extraemos los datos necesarios de la respuesta de la API.
  const { name, main, weather } = weatherData;
  const temperature = main.temp; // Temperatura actual en °C.
  const description = weather[0].description; // Descripción del clima.
  const icon = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`; // Ícono del clima.

  // Renderizamos la tarjeta del clima.
  return (
    <div className="weather-widget">
      <h2 className="city-name">{name}</h2>
      <div className="weather-info">
        <img src={icon} alt={description} className="weather-icon" />
        <div className="weather-details">
          <p className="temperature">{temperature}°C</p>
          <p className="description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;