import React from 'react';
import {Navigate} from 'react-router-dom';
import {useSelector} from "react-redux";
import {userSelector} from "../slices/userSlice";

const PrivateRoute = ({ children }) => {
    const { user } = useSelector(userSelector);
    return user ? children: <Navigate to="/" replace />;
};

export default PrivateRoute;
