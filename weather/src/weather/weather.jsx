import { useState, useEffect } from "react";
import './weathermodule.css';

function Weather() {

    const [city, setCity] = useState('Moscow');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentDayIndex, setCurrentDayIndex] = useState(1);

    const getDates = () => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        return {
            yesterday: yesterday.toISOString().split('T')[0],
            today: today.toISOString().split('T')[0],
            tomorrow: tomorrow.toISOString().split('T')[0]
        };
    };

    const getEnglishDayName = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long' 
            });
        }
    };

    function handleCityChange(event) {
        setCity(event.target.value);
    }

    function handleNextDay() {
        if (weatherData && currentDayIndex < weatherData.days.length - 1) {
            setCurrentDayIndex(currentDayIndex + 1);
        }
    }

    function handlePrevDay() {
        if (currentDayIndex > 0) {
            setCurrentDayIndex(currentDayIndex - 1);
        }
    }

    function GetWeather() {
        setLoading(true);
        setCurrentDayIndex(1);
        
        const dates = getDates();
        const dateRange = `${dates.yesterday}/${dates.tomorrow}`;
        
        fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/${dateRange}?unitGroup=metric&key=H9RDWPRN2VMSA7NXM8UV4LN6C&contentType=json&include=days,current,alerts,hours`, {
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

    useEffect(() => {
        GetWeather();
    }, []);

    const currentDay = weatherData?.days?.[currentDayIndex];

    return(
        <div className="weather-container">
            <div className="weather-header">
                <h1>Weather Forecast</h1>
            </div>
            
            <div className="search-container">
                <input 
                    className="city-input" 
                    value={city} 
                    onChange={handleCityChange} 
                    placeholder="Enter city..."
                />
                
                <button 
                    className="weather-button" 
                    onClick={GetWeather} 
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'Check'}
                </button>
            </div>
            
            {weatherData && currentDay && (
                <div className="weather-results">
                    <h2 className="city-title">{weatherData.resolvedAddress}</h2>
                    
                    <div className="day-navigation">
                        <button 
                            className="nav-button prev-button" 
                            onClick={handlePrevDay}
                            disabled={currentDayIndex === 0}
                        >
                            ←
                        </button>
                        
                        <div className="current-day">
                            <h3 className="day-date">
                                {getEnglishDayName(currentDay.datetime)}
                                <span className="date-small"> ({currentDay.datetime})</span>
                            </h3>
                        </div>
                        
                        <button 
                            className="nav-button next-button" 
                            onClick={handleNextDay}
                            disabled={currentDayIndex === weatherData.days.length - 1}
                        >
                            →
                        </button>
                    </div>

                    <div className="weather-card">
                        <div className="weather-info">
                            <div className="temp-item">
                                <span className="temp-label">Min Temperature:</span>
                                <span className="temp-value">{currentDay.tempmin}°C</span>
                            </div>
                            <div className="temp-item">
                                <span className="temp-label">Max Temperature:</span>
                                <span className="temp-value">{currentDay.tempmax}°C</span>
                            </div>
                            <div className="weather-item">
                                <span className="weather-label">Humidity:</span>
                                <span className="weather-value">{currentDay.humidity}%</span>
                            </div>
                            <div className="weather-item">
                                <span className="weather-label">Wind Speed:</span>
                                <span className="weather-value">{currentDay.windspeed} km/h</span>
                            </div>
                            <div className="weather-item">
                                <span className="weather-label">Precipitation:</span>
                                <span className="weather-value">{currentDay.precip} mm</span>
                            </div>
                            <div className="weather-item description">
                                <span className="weather-label">Description:</span>
                                <span className="weather-value">{currentDay.description}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    ); 
}

export default Weather