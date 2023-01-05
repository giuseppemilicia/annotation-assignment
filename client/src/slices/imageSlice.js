import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
  images: []
};

export const getImages = createAsyncThunk(
    'image/list',
    async (params) => {
        return await axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/images`, {params});
    }
)

export const imageSlice = createSlice({
  name: 'image',
  initialState,
  extraReducers: {
    [getImages.fulfilled]: (state, action) => {
        state.images = action.payload.data.results;
    }
  }
});

export const imageSelector = state => state.image;

export default imageSlice.reducer;
