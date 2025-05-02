import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { fetchWeather } from './store/weatherSlice';
import CloudImage from "../public/clouds.png";

//https://geocoding-api.open-meteo.com/v1/search?name=Chittagong

const App = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state?.weather);

  useEffect(() => {
    dispatch(fetchWeather({ lat: 22.3569, lon: 91.7832 }));
  }, [dispatch]);

  console.log("Weather loading:", loading);
  console.log("Weather data:", data);
  console.log("Weather error:", error);

  return (
    <div className=''>
      <div className="p-10 inter-400">
        <p className="text-xl font-semibold my-1">Chittagong, Bangladesh</p>
        <p className="text-base">30 April, 2025</p>
        <input type="text" className="my-5 px-3 w-full h-10 border-2 border-gray-300 rounded-3xl" />

        {loading && <p>Loading...</p>}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {data && (
          <div className="flex flex-col justify-between items-center my-6 bg-gray-100 border border-gray-200 rounded-3xl p-5">
            <div className="flex flex-col items-center">
              <img src={CloudImage} alt="weather" className="size-28" />
              <p className="text-5xl font-semibold ml-3 my-5">{Math?.round(data?.current?.temperature_2m)}°</p>
            </div>
            <p>Wind Speed: <span>{data?.current?.wind_speed_10m}</span></p>
            <p>{data?.timezone}</p>
          </div>
        )}

        <div>
          <p className='text-lg font-semibold my-5'>Popular Cities</p>
          <div className='flex gap-5'>
            <div className="flex flex-col items-center p-5 rounded-3xl bg-gray-100 border border-gray-200">
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
