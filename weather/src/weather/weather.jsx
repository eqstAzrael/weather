import { useState, useEffect } from "react";
import './weathermodule.css';

function Weather() {

    const [city, setCity] = useState('Moscow');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);


    function handleCityChange(event) {
        setCity(event.target.value);
    }

    function GetWeather() {
        setLoading(true);
        
        fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/2025-11-15?unitGroup=metric&key=H9RDWPRN2VMSA7NXM8UV4LN6C&contentType=json&include=days,current,alerts,hours`, {
                method: 'GET',
                headers: {}
            }).then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
                }).then(data => {
                        setWeatherData(data);
                        setLoading(false);
                }).catch(errorResponse => {
                    if (errorResponse.text) {
                        errorResponse.text().then(errorMessage => {
                        console.error("Error message:", errorMessage);
                        });
                    } else {
                        console.error("Error fetching weather data.");
                        setLoading(false);
                    }
        });
    }

    return(
        <div className="weather-container">
            <div className="weather-header">
                <h1>Прогноз погоды</h1>
            </div>
            
            <div className="search-container">
                <input 
                    className="city-input" 
                    value={city} 
                    onChange={handleCityChange} 
                    placeholder="Введите город..."
                />
                
                <button 
                    className="weather-button" 
                    onClick={GetWeather} 
                    disabled={loading}
                >
                    {loading ? 'Загрузка...' : 'Узнать погоду'}
                </button>
            </div>
            
            
            {weatherData && (
                <div className="weather-results">
                    <h2 className="city-title">Погода в {weatherData.resolvedAddress}</h2>
                    <div className="days-container">
                        {weatherData.days.map((day, index) => (
                            <div key={index} className="day-card">
                                <h3 className="day-date">{day.datetime}</h3>
                                <div className="weather-info">
                                    <div className="temp-item">
                                        <span className="temp-label">Минимальная температура:</span>
                                        <span className="temp-value">{day.tempmin}°C</span>
                                    </div>
                                    <div className="temp-item">
                                        <span className="temp-label">Максимальная температура:</span>
                                        <span className="temp-value">{day.tempmax}°C</span>
                                    </div>
                                    <div className="weather-item">
                                        <span className="weather-label">Осадки:</span>
                                        <span className="weather-value">{day.precip} mm</span>
                                    </div>
                                    <div className="weather-item description">
                                        <span className="weather-label">Описание:</span>
                                        <span className="weather-value">{day.description}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    ); 
}

export default Weather