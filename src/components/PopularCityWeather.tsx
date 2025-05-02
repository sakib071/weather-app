import axios from 'axios';
import React, { useEffect, useState } from 'react'
const CloudImage = "/clouds.png";

type Props = {}

export default function PopularCityWeather({ }: Props) {

  const popularCities = [
    { name: "Dhaka", country: "Bangladesh", lat: 23.8103, lon: 90.4125 },
    { name: "Sylhet", country: "Bangladesh", lat: 24.8949, lon: 91.8687 },
    { name: "Barisal", country: "Bangladesh", lat: 22.7010, lon: 90.3535 },
  ];

  const getWeatherIcon = (temperature: number) => {
    if (temperature >= 30) return "/sun.png";          // Hot
    if (temperature >= 20 && temperature < 30) return "/clouds.png"; // Mild
    return "/heavyRain.png";                          // Cool or rainy-looking fallback
  };


  interface CityWeather {
    name: string;
    country: string;
    lat: number;
    lon: number;
    temperature: number;
  }


  const [popularData, setPopularData] = useState<CityWeather[]>([]);

  useEffect(() => {
    const fetchPopularCitiesWeather = async () => {
      try {
        const requests = popularCities.map(city =>
          axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`)

        );

        const responses = await Promise.all(requests);
        const weatherInfo = responses.map((res, i) => ({
          ...popularCities[i],
          temperature: res.data.current.temperature_2m
        }));


        setPopularData(weatherInfo);
      } catch (err) {
        console.error("Popular cities fetch failed:", err);
      }
    };

    fetchPopularCitiesWeather();
  }, []);


  return (
    <div className=''>
      <p className='text-lg font-semibold my-5'>Popular Cities</p>
      <div className='grid grid-cols-3 gap-3'>
        {popularData.map((city, index) => (
          <div key={index} className="flex flex-col items-center p-5 rounded-3xl bg-sky-50 dark:bg-gray-800">
            <p className="text-smfont-semibold">{city.name}</p>
            {/* <p className="text-sm">{today}</p> */}
            {/* <img src={CloudImage} alt="weather" className="mt-3 size-12" /> */}
            <img
              src={getWeatherIcon(city.temperature)}
              alt="weather"
              className="mt-3 w-12 h-auto background-contain"
            />


            <p className="text-3xl font-semibold ml-3 mt-3">
              {Math.round(city.temperature)}°
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}