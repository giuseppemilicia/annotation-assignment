import bgLogin from "../assets/bg-login.svg";
import TopBar from "../components/TopBar";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {login, userSelector} from "../slices/userSlice";
import {useForm} from "react-hook-form";
import {useEffect} from "react";

function Login() {

    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();
    const navigate = useNavigate();

    const { user, errorMessage } = useSelector(userSelector);

    const onSubmit = (data) => {
        dispatch(login(data));
    };

    useEffect(() => {
        if (user) {
            navigate("/images");
        }
    }, [navigate, user]);

    return (
        <div>
            <img className="position-absolute top-0 end-0 w-25" src={bgLogin} alt="Background" />
            <TopBar title="Sign In"/>
            <div className="d-flex justify-content-center w-100">
                <form
                    className="d-flex flex-column col-12 col-md-8 col-lg-6 col-xl-5"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="form-group mb-3">
                        <label htmlFor="username">Username</label>
                        <input style={{fontWeight: 500}} {...register("username")} type="text" className="form-control" id="username" placeholder="Enter username" required/>
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input style={{fontWeight: 500}} {...register("password")} type="password" className="form-control" id="password" placeholder="Enter your password" required/>
                    </div>
                    {errorMessage && <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>}
                    <button type="submit" className="btn btn-success align-self-center">Login</button>
                    <div className="align-self-center mt-5" style={{fontWeight: 500}}>New here? <NavLink to="/signup">Signup</NavLink></div>
                </form>
            </div>
        </div>
    );
}

export default Login;
