import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';

const App = () => {
  const [city, setCity] = useState('Prishtina');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState('');

  const apiKey = 'fa02f18000a14d3bcd9ebe96fa4eaa99'; 

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (cityName) => {
    try {
      const currentWeatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      setWeatherData(currentWeatherResponse.data);

      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}&units=metric`
      );
      setForecastData(forecastResponse.data);
    } catch (err) {
      setError('City not found. Please try again.');
    }
  };

  const handleCityChange = (cityName) => {
    setCity(cityName);
    fetchWeatherData(cityName);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-indexed
    const year = date.getFullYear();
    const weekday = date.toLocaleString('default', { weekday: 'long' });

    return `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year} ${weekday}`;
  };

  const getTimeOfDay = (hour) => {
    if (hour >= 6 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Midday';
    return 'Evening';
  };

  const groupForecastByDay = (forecastList) => {
    const groupedForecast = [];

    forecastList.forEach((forecast) => {
      const date = new Date(forecast.dt * 1000);
      const day = date.getDate();
      const hour = date.getHours();
      const timeOfDay = getTimeOfDay(hour);

      let existingDay = groupedForecast.find((group) => group.date === day);

      if (!existingDay) {
        existingDay = { date: day, forecasts: {} };
        groupedForecast.push(existingDay);
      }

      // Add forecast only if it doesn't already exist for the same time of day
      if (!existingDay.forecasts[timeOfDay]) {
        existingDay.forecasts[timeOfDay] = { ...forecast, timeOfDay };
      }
    });

    return groupedForecast;
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Weather Forecast</h1>
      </header>
      <SearchBar city={city} onSearch={handleCityChange} />
      {error && <div className="error">{error}</div>}
      {weatherData && <WeatherCard data={weatherData} />}
      {forecastData && (
        <div className="forecast">
          {groupForecastByDay(forecastData.list).map((dayForecast, index) => (
            <div key={index} className="forecast-day">
              <h3>{formatDate(dayForecast.forecasts[Object.keys(dayForecast.forecasts)[0]].dt)}</h3>
              <div className="forecast-cards">

                
                {/* Sort the time of day to be: Morning -> Midday -> Evening */}
                {['Morning', 'Midday', 'Evening'].map((timeOfDay, idx) => (
                  dayForecast.forecasts[timeOfDay] ? (
                    <div key={idx} className="forecast-card">
                      <h4>{timeOfDay}</h4>
                      <p>{dayForecast.forecasts[timeOfDay].weather[0].description}</p>
                      <p>{dayForecast.forecasts[timeOfDay].main.temp}°C</p>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
