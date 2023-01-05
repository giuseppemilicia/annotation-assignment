import TopBar from "../components/TopBar";
import {useDispatch, useSelector} from "react-redux";
import {logout, userSelector} from "../slices/userSlice";

function User() {

    const dispatch = useDispatch();
    const { user } = useSelector(userSelector);

    return (
        <div>
            <TopBar
                title="My Account"
                actionBtn={
                    <div>
                        <button
                            className="btn mb-2 me-2"
                            style={{color: "#EE6363"}}
                            onClick={() => {
                                dispatch(logout());
                            }}
                        >Logout</button>
                    </div>
                }
            />
            <div className="d-flex flex-md-row flex-column w-100">
                <div className="d-flex flex-column mt-3 mt-md-0">
                    <div className="px-2" style={{color: "#666666"}}>
                        <div className="d-flex flex-column">
                            <div className="d-inline-flex">
                                <div className="form-group mb-3 me-5">
                                    <label htmlFor="name">Username</label>
                                    <input type="text" className="form-control" id="name" placeholder="Enter first name" value={user.username} required disabled/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default User;
