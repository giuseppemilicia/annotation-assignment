import logo from "../assets/logo.svg";
import menu from "../assets/menu.svg";
import userImg from "../assets/user.svg";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {userSelector} from "../slices/userSlice";

function SideBar() {

    const { user } = useSelector(userSelector);

    return (
        <div className="col-md-auto mt-md-4 mb-md-4 border-end sticky-top bg-white">
            <div className="d-flex flex-md-column flex-row flex-nowrap align-items-center sticky-top h-100">
                <NavLink to="/" className="d-block mb-md-4 p-3 link-dark text-decoration-none">
                    <img src={logo} alt="Logo" />
                </NavLink>
                {user && <>
                    <ul className="nav nav-pills nav-flush flex-md-column flex-row flex-nowrap mb-auto mx-auto text-center align-items-center">
                        <li>
                            <NavLink to="/images" className="nav-link py-3 px-2 pt-2" style={{width: "60px", height: "60px"}}>
                                <img src={menu} alt="Archive" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/annotations" className="nav-link py-3 px-2 pt-2" style={{width: "60px", height: "60px"}}>
                                <img src={menu} alt="Annotations" />
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/user" className="d-block p-3 link-dark text-decoration-none">
                                <img src={userImg} alt="User" />
                            </NavLink>
                        </li>
                    </ul>
                </>}
            </div>
        </div>
    );
}

export default SideBar;
