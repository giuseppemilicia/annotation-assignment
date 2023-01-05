import TopBar from "../components/TopBar";
import ImageThumbnail from "../components/ImageThumbnail";
import {useDispatch, useSelector} from "react-redux";
import {getImages, imageSelector} from "../slices/imageSlice";
import {useEffect, useState} from "react";
import axios from "axios";
import {useLocation} from "react-router-dom";

function Archive() {

    const { images } = useSelector(imageSelector);
    const dispatch = useDispatch();
    const location = useLocation();
    const [readMode, setReadMode] = useState();

    useEffect(() => {
        const readMode = location.pathname !== '/images';
        setReadMode(readMode);
        dispatch(getImages({"only_annotated": readMode}));
    }, [dispatch, location]);

    return (
        <div>
            <TopBar
                title={readMode ? "My Annotated" : "My Images"}
                actionBtn={
                    readMode === false && <>
                        <label htmlFor="file-upload" className="btn btn-primary mb-2 me-5">
                            <i className="fa fa-cloud-upload"></i> Click here to browse and upload images
                        </label>
                        <input type="file" onChange={async (e) => {
                            for (const file of e.target.files) {
                                const formData = new FormData();
                                formData.append("file", file);
                                await axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/images`, formData);
                            }
                            dispatch(getImages());
                        }} className="d-none" id="file-upload" multiple />
                    </>
                }
            />
            <div>
                {images.map(i => <ImageThumbnail key={i.id} id={i.id} title={i.name} readMode={readMode} />)}
            </div>
        </div>
    );
}

export default Archive;
