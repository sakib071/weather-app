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
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&hourly=relative_humidity_2m,rain`;
    const response = await axios.get(url);
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
