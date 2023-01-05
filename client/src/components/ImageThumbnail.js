import {NavLink} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";

function ImageThumbnail(props) {

    const [src, setSrc] = useState();

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/images/${props.id}`, {responseType: "blob"}).then(response => {
            const blob = new Blob(
                [response.data],
                { type: response.headers['content-type'] }
            )
            const image = URL.createObjectURL(blob)
            setSrc(image);
        });
    }, [props.id]);

    return (
        <NavLink to={(props.readMode ? "/check-annotate/" : "/annotate/") + props.id} style={{textDecoration: "none", color: "#222222", margin: "5px"}}>
            <div className="card" style={{width: "18rem", backgroundColor: "#F4F4F4", border: "0px"}}>
                {src && <img src={src} className="card-img-top p-1" alt={props.title} />}
                <div className="card-body">
                    <h5 className="d-flex justify-content-center card-title">{props.title}</h5>
                </div>
            </div>
        </NavLink>
    );
}

export default ImageThumbnail;
