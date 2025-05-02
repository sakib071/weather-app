import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { fetchWeather } from './store/weatherSlice';
import CloudImage from "../public/clouds.png";

//https://geocoding-api.open-meteo.com/v1/search?name=Chittagong

const App = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state?.weather);
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const rainNow = data?.hourly?.rain?.[data?.hourly?.time.indexOf(data?.current?.time)];
  const currentTime = data?.current?.time;
  const humidityIndex = data?.hourly?.time?.indexOf(currentTime);
  const humidity = data?.hourly?.relative_humidity_2m?.[humidityIndex];
  const today = new Date().toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    // Fetch default city (Chittagong) weather on mount
    dispatch(fetchWeather({ lat: 22.3569, lon: 91.7832 }));
    setCityName({ name: 'Chittagong', country: 'Bangladesh' });
  }, [dispatch]);

  const handleSearch = async () => {
    if (!city) return;

    try {
      const response = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );

      const result = response.data.results?.[0];
      setCityName(result);

      if (result) {
        dispatch(fetchWeather({ lat: result.latitude, lon: result.longitude }));
      } else {
        console.log("City not found.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  // console.log("Weather loading:", loading);
  console.log("Weather data:", data);
  // console.log("Weather error:", error);

  return (
    <div className=''>
      <div className="px-8 py-6 inter-400">
        <p className="text-xl font-semibold my-1">{cityName.name}, {cityName.country}</p>
        <p className="text-base">{today}</p>

        <div className="relative my-5">
          <input
            type="text"
            id="Search"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Search city"
            className="mt-0.5 px-3 w-full text-sm text-gray-600 border-gray-300 h-10 border-2 rounded-3xl shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
          />

          <span className="absolute inset-y-0 right-2 grid w-8 place-content-center">
            <button
              type="button"
              aria-label="Submit"
              onClick={handleSearch}
              className="rounded-full p-1.5 text-gray-700 transition-colors hover:bg-gray-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>
          </span>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {data && (
          <div className="w-full flex flex-col justify-between items-center my-5">
            <div className="flex flex-col items-center">
              <img src={CloudImage} alt="weather" className="size-28" />
              <p className="text-5xl font-semibold ml-3 my-5">
                {Math.round(data?.current?.temperature_2m)}°
              </p>
              <div className='flex items-center justify-center gap-1 w-full'>
                <p className='text-sm font-bold'>Condition:</p>
                <p>
                  {data?.current?.temperature_2m > 30 ? "Hot & Sunny"
                    : data?.current?.relative_humidity_2m > 70 ? "Humid"
                      : "Mild"}
                </p>
              </div>
            </div>

            <div className="h-24 text-center grid grid-cols-3 items-center gap-10 my-5 rounded-3xl p-3 bg-sky-50">
              <div className='flex flex-col items-center'>
                <p className='text-sm font-bold'>Humidity</p>
                <p className='text-sm'>{data?.current?.relative_humidity_2m}%</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-sm font-bold'>Wind Speed</p>
                <p className='text-sm'>{data?.current?.wind_speed_10m} km/h</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-sm font-bold'>Rain</p>
                <p>{rainNow > 0 ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        )}


        <div>
          <p className='text-lg font-semibold my-5'>Popular Cities</p>
          <div className='flex gap-5'>
            <div className="flex flex-col items-center p-5 rounded-3xl bg-sky-50">
              <p className="text-lg font-semibold">Dhaka</p>
              <p className="text-sm">30 April, 2025</p>
              <img src={CloudImage} alt="weather" className="mt-3 size-12" />
              <p className="text-3xl font-semibold ml-3 mt-3">{Math?.round(data?.current?.temperature_2m)}°</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
