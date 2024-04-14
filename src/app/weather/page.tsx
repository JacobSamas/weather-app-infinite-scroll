"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'

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
  }, [lat, lon]);

  const weatherBackground = (description: string) => {
    if (!description) return "bg-gray-200";
    const weatherType = description.toLowerCase();
    if (weatherType.includes("cloud")) return "bg-gray-300";
    if (weatherType.includes("rain")) return "bg-blue-400";
    if (weatherType.includes("clear")) return "bg-blue-200";
    return "bg-indigo-300";
  };

  const getWeatherEmoji = (weather: any) => {
    const main: any = weather.main;
    if (main === "Clear") return "☀️";
    if (main === "Clouds") return "☁️";
    if (main === "Rain") return "🌧";
    if (main === "Snow") return "❄️";
    if (main === "Drizzle") return "🌦";
    if (main === "Thunderstorm") return "⛈";
    return "🌀"; // for other types of weather
  };

  if (error) {
    return <div className="text-red-500 text-lg p-4">Error: {error}</div>;
  }

  if (!weatherData) {
    return <div className="text-blue-500 text-lg p-4">Loading...</div>;
  }

  const { main, weather, wind, sys, name } = weatherData as any;
  const temperature = main.temp - 273.15; // Convert Kelvin to Celsius
  const background = weatherBackground(weather[0].description);
  const emoji = getWeatherEmoji(weather[0]);

  return (
    <Suspense>
      <div
        className={`p-5 ${background} flex flex-col items-center justify-center min-h-screen transition-all duration-500`}
      >
        <div className="text-white text-center shadow-lg p-5 rounded-lg bg-opacity-80 bg-black">
          <h1 className="text-4xl font-bold mb-2">
            Weather in {name} {emoji}
          </h1>
          <p className="text-xl">
            Current Temperature: {temperature.toFixed(2)}°C
          </p>
          <p className="text-lg capitalize">{weather[0].description}</p>
          <p className="text-lg">Humidity: {main.humidity}%</p>
          <p className="text-lg">Wind Speed: {wind.speed} m/s</p>
          <p className="text-lg">
            Sunrise: {new Date(sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p className="text-lg">
            Sunset: {new Date(sys.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
      </div>
    </Suspense>
  );
}
