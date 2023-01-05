import TopBar from "../components/TopBar";
import {NavLink, useLocation, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import { Annotorious } from '@recogito/annotorious';
import '@recogito/annotorious/dist/annotorious.min.css';
import DropdownWidget from "../components/DropdownWidget";

function AnnotateEditor() {

    const { id } = useParams();
    const [src, setSrc] = useState();
    const [anno, setAnno] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const [readMode, setReadMode] = useState();
    const [csv, setCsv] = useState();

    useEffect(() => {
        const readMode = location.pathname.startsWith('/check-annotate');
        setReadMode(readMode);

        let annotorious = null;
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/images/${id}`, {responseType: "blob"}).then(response => {
            const blob = new Blob(
                [response.data],
                { type: response.headers['content-type'] }
            )
            const image = URL.createObjectURL(blob)
            setSrc(image);
            annotorious = new Annotorious({
                image: document.getElementById('annotate-image'),
                widgets: [
                    DropdownWidget
                ],
                readOnly: readMode
            });
            axios.get(`${process.env.REACT_APP_API_BASE_URL}/v1/images/${id}/annotation`).then(response => {
                const annotations = response.data.results.map(r => {
                    return {
                        type:"Annotation",
                        id: `#${r.id}`,
                        body: [{type: "ImageType", value: r.type}],
                        target: {
                            selector: {
                                conformsTo: "http://www.w3.org/TR/media-frags/",
                                type: "FragmentSelector",
                                value: `xywh=pixel:${r.coordinates}`
                            }
                        }
                    };
                });
                const csvFile = response.data.results.map(r => {
                    return r.name + "," + r.coordinates;
                }).join("\r\n");
                setCsv(csvFile);
                annotorious.setAnnotations(annotations);
            });
            setAnno(annotorious);
        });
        return () => annotorious?.destroy();
    }, [id, location]);


    return (
        <div>
            <TopBar
                title={readMode ? "Check Annotated or Download CSV" : "Annotate"}
                actionBtn={
                    <div>
                        <NavLink to={readMode ? "/annotations" : "/images"} type="submit" className="btn btn-secondary mb-2 me-2">Cancel</NavLink>
                        {readMode ?
                            <div onClick={() => {
                                const a = window.document.createElement('a');
                                a.href = window.URL.createObjectURL(new Blob([csv], {type: 'text/csv'}));
                                a.download = 'annotations.csv';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                            }} className="btn btn-success mb-2 me-5">Download CSV</div> :
                            <div onClick={() => {
                                const annotations = anno.getAnnotations().map(a => {
                                    return {
                                        type: a.body[0].value,
                                        coordinates: a.target.selector.value.replace("xywh=pixel:", "")
                                    };
                                });
                                axios.post(`${process.env.REACT_APP_API_BASE_URL}/v1/images/${id}/annotation`, {annotations}).then(() => {
                                    navigate("/images");
                                });
                            }} className="btn btn-success mb-2 me-5">Save</div>
                        }
                    </div>
                }
            />
            <div className="d-flex flex-md-row flex-column w-100">
                <img id="annotate-image" src={src} style={{width: "20rem"}} alt="Annotate" />
            </div>
        </div>
    );
}

export default AnnotateEditor;
