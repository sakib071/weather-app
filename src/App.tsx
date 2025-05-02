import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { fetchWeather } from './store/weatherSlice';
// import CloudImage from "../public/clouds.png";
import PopularCityWeather from './components/PopularCityWeather';
import React from 'react';
import { OrbitProgress } from 'react-loading-indicators';


const App = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state?.weather);
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState<{ name: string; country: string }>({ name: '', country: '' });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const rainNow = data?.hourly?.rain?.[data?.hourly?.time.indexOf(data?.current?.time)];
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

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('weatherSearchHistory') || '[]');
    setSearchHistory(history);
  }, []);


  const getWeatherIcon = (temperature: number) => {
    if (temperature >= 30) return "/sun.png";          // Hot
    if (temperature >= 20 && temperature < 30) return "/clouds.png"; // Mild
    return "/heavyRain.png";                          // Cool or rainy-looking fallback
  };

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

        // Update search history
        const updatedHistory = [result.name, ...searchHistory.filter(name => name !== result.name)].slice(0, 5);
        setSearchHistory(updatedHistory);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(updatedHistory));
      }

      if (result) {
        dispatch(fetchWeather({ lat: result.latitude, lon: result.longitude }));
      } else {
        console.log("City not found.");
      }
    } catch (err) {
      console.error("Geocoding error:", err);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('weatherAppTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('weatherAppTheme', 'light');
    }
  };


  // console.log("Weather loading:", loading);
  // console.log("Weather data:", data);
  // console.log("Weather error:", error);

  return (
    <div className=''>
      <div className="px-8 py-6 inter-400 bg-white text-black dark:bg-gray-900 dark:text-white max-w-md mx-auto min-h-screen transition-colors">
        <div>
          <div className='flex justify-between items-start'>
            <p className="text-xl font-semibold my-1">{`${cityName.name}, ${cityName.country}`}</p>
            <div className="flex justify-end mb-4">
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1 text-sm rounded-full border border-gray-400 dark:border-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
            </div>
          </div>
          <p className="text-base">{today}</p>
        </div>

        <div className="relative my-5">
          <input
            type="text"
            id="Search"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setTimeout(() => setIsInputFocused(false), 100)} // delay to allow button click
            placeholder="Search city"
            className="px-4 w-full text-sm bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-300 h-10 border-2 rounded-3xl shadow-sm focus:border-gray-900 focus:outline-none focus:ring-gray-900"
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

        <div className='flex flex-col items-center'>
          {isInputFocused && searchHistory.length > 0 && (
            <div className="absolute z-10 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-md -mt-3  mx-auto w-full max-w-[340px]">
              {searchHistory.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCity(item);
                    setIsInputFocused(false);
                    handleSearch();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-200 text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>


        {loading && <p className='w-full h-[340px] flex justify-center items-center text-center'><OrbitProgress color="#282727" size="medium" text="" textColor="" /></p>}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {loading || data && (
          <div className="w-full h-[340px] flex flex-col justify-between items-center my-5">
            <div className="w-full flex flex-col items-center">
              <img
                src={getWeatherIcon(data?.current?.temperature_2m)}
                alt="weather"
                className="mt-3 size-24"
              />
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

            <div className="w-full h-32 text-center grid grid-cols-3 items-center gap-10 mt-3 rounded-3xl p-3 bg-sky-50 dark:bg-gray-800">
              <div className='flex flex-col items-center'>
                <p className='text-xs sm:text-sm font-bold'>Humidity</p>
                <p className='text-sm'>{data?.current?.relative_humidity_2m}%</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-sm font-bold'>Wind Speed</p>
                <p className='text-sm'>{data?.current?.wind_speed_10m} km/h</p>
              </div>
              <div className='flex flex-col items-center'>
                <p className='text-sm font-bold'>Rain</p>
                <p className='text-sm'>{rainNow > 0 ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        )}

        <PopularCityWeather />
      </div>
    </div>
  );
};

export default App;
