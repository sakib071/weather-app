import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface WeatherState {
  loading: boolean;
  error: string | null;
  data: any | null;
}

const initialState: WeatherState = {
  loading: false,
  error: null,
  data: null,
};

export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async ({ lat, lon }: { lat: number; lon: number }) => {
    const API_KEY = `c98d53c6917a4fdd8f899a3ba3d34393`;
    const response = await axios.get(
      // `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=${API_KEY}`
    );
    return response.data;
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export default weatherSlice.reducer;
