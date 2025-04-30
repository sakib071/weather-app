import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks/hooks';
import { fetchWeather } from './store/weatherSlice';
import CloudImage from "../public/clouds.png";

const App = () => {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.weather);

  useEffect(() => {
    dispatch(fetchWeather({ lat: 22.3569, lon: 91.7832 }));
  }, [dispatch]);

  console.log("Weather loading:", loading);
  console.log("Weather data:", data);
  console.log("Weather error:", error);

  return (
    <div className='bg-yellow-100'>
      {/* <QuestionPage></QuestionPage> */}
      <div className="p-10 inter-400">
        <p className="text-2xl font-semibold my-1">Chittagong, Bangladesh</p>
        <p className="text-lg">30 April, 2025</p>
        <input type="text" className="my-5 px-3 w-full h-10 border-2 border-gray-600 rounded-3xl" />

        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {data && (
          <div className="flex flex-col justify-between items-center my-10">
            <div className="flex flex-col items-center">
              <img src={CloudImage} alt="weather" className="size-32" />
              <p className="text-5xl font-semibold ml-3 my-5">{Math.round(data.current.temp)}°</p>
            </div>
            <p className="text-lg">{data.current.weather[0].main}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
