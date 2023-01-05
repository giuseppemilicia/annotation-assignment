import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import axios from "axios";

const initialState = {
  user: undefined,
  errorMessage: undefined
};

export const signup = createAsyncThunk(
    'user/signup',
    async (user) => {
        return await axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/users/signup`, user, {validateStatus: () => true});
    }
)

export const login = createAsyncThunk(
    'user/login',
    async (user) => {
        return await axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/users/login`, user, {validateStatus: () => true});
    }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = undefined;
      state.errorMessage = undefined;
      delete axios.defaults.headers.common['Authorization'];
    },
  },
  extraReducers: {
    [signup.fulfilled]: (state, action) => {
        state.user = action.payload.status === 200 ? action.payload.data : undefined;
        state.errorMessage = action.payload.status !== 200 ? action.payload.data.detail : undefined;
        axios.defaults.headers.common['Authorization'] = action.payload.status === 200 ? action.payload.data.authorization : undefined;
    },
    [login.fulfilled]: (state, action) => {
        state.user = action.payload.status === 200 ? action.payload.data : undefined;
        state.errorMessage = action.payload.status !== 200 ? action.payload.data.detail : undefined;
        axios.defaults.headers.common['Authorization'] = action.payload.status === 200 ? action.payload.data.authorization : undefined;
    }
  }
});

export const { logout } = userSlice.actions;

export const userSelector = state => state.user;

export default userSlice.reducer;
