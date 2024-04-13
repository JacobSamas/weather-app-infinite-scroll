"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiKey = "67816cdd804aadde7f3116a894c47d68";
    if (lat && lon) {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      axios
        .get(url)
        .then((response) => {
          setWeatherData(response.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [lat, lon]); // Dependencies to trigger the effect

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!weatherData) {
    return <div>Loading...</div>; // Or some other placeholder content
  }

  const { main, weather, wind, sys, name } = weatherData;
  const temperature = main.temp - 273.15; // Convert Kelvin to Celsius

  return (
    <div>
      <h1>Weather in {name}</h1>
      <p>Current Temperature: {temperature.toFixed(2)}°C</p>
      <p>Description: {weather[0].description}</p>
      <p>Humidity: {main.humidity}%</p>
      <p>Wind Speed: {wind.speed} m/s</p>
      <p>Sunrise: {new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
      <p>Sunset: {new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
    </div>
  );
}
