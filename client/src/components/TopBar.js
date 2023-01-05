function TopBar(props) {
    return (
        <div className="row">
            <div className={`d-inline-flex justify-content-between mt-sm-4 mb-sm-4 ${props.actionBtn && "border-bottom"}`}>
                <h3 style={{fontWeight: 500}}>{props.title}</h3>
                {props.actionBtn}
            </div>
        </div>
    );
}

export default TopBar;
